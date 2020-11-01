const express = require("express");

const app = express();
const port = 7777;

app.get("/", (req: any, res: any) => {
  res.json({ hello: "world" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export {};
