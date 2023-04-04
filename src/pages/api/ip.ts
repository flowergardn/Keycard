import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

// This is here since I can't call ip risk from the client-side

const ip = async (req: NextApiRequest, res: NextApiResponse) => {
  const ip = req.headers["x-forwarded-for"] ?? "8.8.8.8";

  const d = await axios.get(`https://api.iprisk.info/v1/${ip}`);

  res.json({
    ...d.data,
  });
};

export default ip;
