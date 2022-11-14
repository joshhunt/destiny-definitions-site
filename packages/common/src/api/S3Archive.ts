import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandOutput,
  GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import type {
  AllDefinitionDiffs,
  DefinitionDiffSummary,
  ManifestVersion,
} from "../types";
import invariant from "tiny-invariant";
import { Readable } from "stream";
import type { DestinyManifest } from "bungie-api-ts/destiny2";

interface S3ArchiveConfig {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region: string;
}

export class S3Archive {
  bucket: string;
  s3Client: S3Client;

  constructor(config: S3ArchiveConfig) {
    invariant(config, "Must specify S3ArchiveConfig");
    invariant(config.bucket, "Must specify config.bucket");
    invariant(config.region, "Must specify config.region");
    invariant(config.accessKeyId, "Must specify config.accessKeyId");
    invariant(config.secretAccessKey, "Must specify config.secretAccessKey");

    this.bucket = config.bucket;

    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  getObjectCommand(input: GetObjectCommandInput) {
    return new GetObjectCommand(input);
  }

  async getJsonS3Object<T = unknown>(key: string): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
      let response: GetObjectCommandOutput;

      try {
        response = await this.s3Client.send(command);
      } catch (err) {
        return reject(err);
      }

      if (!response.Body) {
        throw new Error("No body on response");
      }

      if (!(response.Body instanceof Readable)) {
        throw new Error("Body is not instanceof Readable");
      }

      let responseDataChunks: Array<string> = [];
      response.Body.once("error", (err) => reject(err));
      response.Body.on("data", (chunk: string) =>
        responseDataChunks.push(chunk)
      );
      response.Body.once("end", () =>
        resolve(JSON.parse(responseDataChunks.join("")) as T)
      );
    });
  }

  async getVersionHistory(): Promise<ManifestVersion[]> {
    return await this.getJsonS3Object<ManifestVersion[]>("index.json");
  }

  async getVersion(id: string): Promise<ManifestVersion> {
    const history = await this.getVersionHistory();
    const version = history.find((v) => v.id === id);
    invariant(version, "could not find version for id " + id);
    invariant(
      version.id === id,
      "version id does not match. this should never happen (famous last words)"
    );
    return version;
  }

  async getPreviousVersion(id: string) {
    const history = await this.getVersionHistory();
    const prevVersionIndex = history.findIndex((v) => v.id === id) - 1;
    const version = history[prevVersionIndex];
    return version;
  }

  async getVersionDiff(id: string) {
    return await this.getJsonS3Object<AllDefinitionDiffs>(
      `versions/${id}/diff.json`
    );
  }

  async getVersionManifest(id: string) {
    return await this.getJsonS3Object<DestinyManifest>(
      `versions/${id}/manifest.json`
    );
  }

  async getVersionDiffSummary(id: string): Promise<DefinitionDiffSummary[]> {
    const diff = await this.getVersionDiff(id);

    const entries = Object.entries(diff);

    return entries
      .map(([tableName, v]) => ({
        tableName,
        removed: v.removed.length,
        added: v.added.length,
        unclassified: v.unclassified.length,
        reclassified: v.reclassified.length,
        modified: (v.modified ?? []).length,
      }))
      .filter(
        (v) =>
          v.removed || v.added || v.unclassified || v.reclassified || v.modified
      );
  }
}
