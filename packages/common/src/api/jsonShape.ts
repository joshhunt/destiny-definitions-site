export interface JSONExtractQueryObject {
  [key: string]: JSONExtractQueryObject | number;
}

export function makeJsonExtractQuery(
  field: string,
  shape: JSONExtractQueryObject,
  parentPath: string[] = ["$"]
): string {
  const pairs: string[] = [];

  for (const key in shape) {
    const value = shape[key];
    const path = [...parentPath, key];
    let sql: string;

    if (typeof value === "object") {
      const child = makeJsonExtractQuery(field, value, path);
      sql = `'${key}', ${child}`;
    } else {
      const sqlValue = `${field}->'${path.join(".")}'`;
      sql = `'${key}', ${sqlValue}`;
    }

    pairs.push(sql);
  }

  const params = pairs.join(", ");

  return `json_object(${params})`;
}
