import { expect, test } from "vitest";
import { makeJsonExtractQuery } from "./jsonShape";

test("works with a single key", () => {
  const result = makeJsonExtractQuery("data", { postCode: 1 });
  expect(result).toEqual("json_object('postCode', data->'$.postCode')");
});

test("works with an object with multiple keys", () => {
  const result = makeJsonExtractQuery("data", { postCode: 1, town: 1 });

  expect(result).toEqual(
    "json_object('postCode', data->'$.postCode', 'town', data->'$.town')"
  );
});

test("works with a nested object", () => {
  const result = makeJsonExtractQuery("data", {
    name: 1,
    address: { postCode: 1, town: 1 },
  });

  expect(result).toEqual(
    "json_object('name', data->'$.name', 'address', json_object('postCode', data->'$.address.postCode', 'town', data->'$.address.town'))"
  );
});
