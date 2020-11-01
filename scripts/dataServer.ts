const express = require("express");

const app = express();
const port = 7777;

app.get("/", (req: any, res: any) => {
  res.json({ hello: "world" });
});

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export {};

process.on("SIGTERM", function (code) {
  console.log("SIGTERM received...");
  server.close();
});

server.on("close", function () {
  process.exit(0);
});
