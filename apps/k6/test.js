import http from "k6/http";
import { group } from "k6";
import { parseHTML } from "k6/html";

export const options = {
  ext: {
    loadimpact: {
      distribution: {
        "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 50 },
        "amazon:gb:london": { loadZone: "amazon:gb:london", percent: 25 },
        "amazon:au:sydney": { loadZone: "amazon:au:sydney", percent: 10 },
        "amazon:jp:tokyo": { loadZone: "amazon:jp:tokyo", percent: 15 },
      },
      apm: [],
    },
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: "ramping-vus",
      gracefulStop: "30s",
      stages: [
        { target: 50, duration: "1m" },
        { target: 50, duration: "5m30s" },
        { target: 0, duration: "1m" },
      ],
      gracefulRampDown: "30s",
      exec: "scenario_1",
    },
  },
};

// const targetVersionId = "pee-pee";
const targetVersionId = "4ee62da4-eb5f-4a05-83f3-9a311960cfb5";
const siteRoot = `https://destiny-definitions-archive.fly.dev`;

const getIndexPage = (pageNumber) => `${siteRoot}/${pageNumber}`;

const getVersionPage = (version) => `${siteRoot}/version/${targetVersionId}`;

const get = (url, options) => {
  console.log("Getting", url);
  return http.get(url, options);
};

export function scenario_1() {
  group("Find version in index", () => {
    let pageNumber = 1;
    const running = true;

    while (running) {
      const res = get(getIndexPage(pageNumber), {
        tags: { name: "index-page" },
      });
      const page = parseHTML(res.body);

      // First, check to main sure there's versions on this page!
      const versionsOnPage = page.find(`[data-testid="version"]`);

      if (versionsOnPage.size() === 0) {
        throw new Error("No versions on index page " + pageNumber);
      }

      const versionLink = page.find(`a[href="/version/${targetVersionId}"]`);

      if (versionLink.size()) {
        // Found the version!
        return true;
      } else {
        pageNumber += 1;
      }

      if (pageNumber >= 6) {
        throw new Error("Reached max page number. Could not find version");
      }
    }
  });

  group("Load version", () => {
    const versionRes = get(getVersionPage(targetVersionId), {
      tags: { name: "version-page" },
    });
    const versionPage = parseHTML(versionRes.body);

    const tableDiffLinks = versionPage
      .find(`[data-testid="version-table-link"]`)
      .map((index, el) => {
        const href = el.attr("href");
        const isJunk = el.parents(`[data-testid="junk-table-row"]`).size() > 0;
        return { href, isJunk };
      });

    shuffle(tableDiffLinks);

    for (const { href: tableDiffPath, isJunk } of tableDiffLinks) {
      const tableRes = get(siteRoot + tableDiffPath, {
        tags: { name: "table-diff" },
      });

      if (isJunk) {
        continue;
      }

      const tablePage = parseHTML(tableRes.body);

      const truncationLinks = tablePage
        .find(`[data-testid="truncation-link"]`)
        .map((index, el) => el.attr("href"));

      shuffle(truncationLinks);

      for (const truncationLink of truncationLinks) {
        const res = get(siteRoot + truncationLink, {
          tags: { name: "table-diff-for-type" },
        });
        const page = parseHTML(res.body);

        const defDiffURLs = page
          .find(`[data-testid="definition-diff-link"]`)
          .map((index, el) => el.attr("href"))
          .slice(0, 10);

        for (const defDiffUrl of defDiffURLs) {
          get(siteRoot + defDiffUrl, {
            tags: { name: "modified-definition-diff" },
          });
        }
      }
    }
  });
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
