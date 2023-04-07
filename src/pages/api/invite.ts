import type { NextApiRequest, NextApiResponse } from "next";

const invite = async (req: NextApiRequest, res: NextApiResponse) => {
  res.redirect(
    "https://discord.com/api/oauth2/authorize?client_id=1092191075805954158&permissions=268435456&scope=bot"
  );
};

export default invite;
