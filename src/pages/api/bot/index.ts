import type { NextApiRequest, NextApiResponse } from "next";
import type {
  APIChatInputApplicationCommandInteractionData,
  APIGuildMember,
} from "discord-api-types/v10";
import { InteractionType } from "discord-api-types/v10";

import { sign } from "tweetnacl";

export interface Interaction {
  data: APIChatInputApplicationCommandInteractionData;
  member: APIGuildMember;
}

export interface CommandOptions {
  res: NextApiResponse;
  req: NextApiRequest;
  interaction: Interaction;
}

const bot = async (req: NextApiRequest, res: NextApiResponse) => {
  const { type } = req.body;

  // Your public key can be found on your application in the Developer Portal
  const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];

  // If neither are provided, something is up.
  if (!signature || !timestamp) {
    res.status(401);
    res.send("Bad request signature");
    return;
  }

  // I am way too lazy to fix the issues with buffers, so that's why there is some @ts-ignore below.
  // Feel free to remove it and PR the fix :)
  const isVerified = sign.detached.verify(
    Buffer.from(timestamp + JSON.stringify(req.body)),
    // @ts-ignore
    Buffer.from(signature, "hex"),
    // @ts-ignore
    Buffer.from(PUBLIC_KEY, "hex")
  );

  if (!isVerified) {
    res.status(401);
    res.send("Bad request signature");
    return;
  }

  // ACK pings
  if (type === 1) {
    res.json({ type: 1 });
    return;
  }

  if (type === InteractionType.ApplicationCommand) {
    const interaction = req.body;

    try {
      const command = await import(`../bot/commands/${interaction.data.name}`);
      await command.execute({
        interaction,
        res,
        req,
      });
    } catch (err: any) {
      console.log(err.message);
      console.log(`command does not exist`);
    }
  }
};

export default bot;
