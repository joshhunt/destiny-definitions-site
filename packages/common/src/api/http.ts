import type { HttpClientConfig } from "bungie-api-ts/destiny2";

export function createHttpClient(apiKey: string) {
  return async function $http(config: HttpClientConfig) {
    const resp = await fetch(config.url, {
      method: config.method,
      body: config.body,
      headers: {
        "x-api-key": apiKey,
      },
    });

    return resp.json();
  };
}
