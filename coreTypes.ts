// Note: All DDA___ interfaces are API responses

export interface DDAVersion {
  /** A destiny-definitions specific ID unique to this version. */
  readonly id: string;

  /** The version field from the Destiny manifest. Historical versions are not guarenteed to be unique. */
  readonly version: string;

  /** S3 key for accessing data from this version. Usually this will contain the ID. */
  readonly s3Key: string;

  /** The date this version was created/ingested by the destiny-definitions service. Should roughly track when Bungie released it. */
  readonly createdAt: Date;

  /** The date this version was last modified by the destiny-definitions service, if it is reprocessed at a later date. */
  readonly updatedAt: Date;
}

type HashList = number[];

export interface DDATableDiff {
  /** List of hashes for entries that were removed in a particular version */
  readonly removed: HashList;

  /** List of hashes for entries that were added in a particular version */
  readonly added: HashList;

  /** List of hashes for entries that were unclassified in a particular version */
  readonly unclassified: HashList;

  /** List of hashes for entries that were reclassified in a particular version */
  readonly reclassified: HashList;

  /** List of hashes for entries that were modified in a particular version */
  readonly modified: HashList;
}

export interface VersionDiffGrouping {
  groupTitle?: string;
  groupId?: string;
  hashes: HashList;
}

export type GroupedVersionDiff = Record<
  keyof DDATableDiff,
  VersionDiffGrouping
>;
