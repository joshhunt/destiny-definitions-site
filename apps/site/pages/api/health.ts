import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.send("🚀");
}
