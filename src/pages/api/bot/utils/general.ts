import { Interaction } from "~/pages/api/bot/index";

interface Option {
  name: string;
  type: number;
  value: string;
}

export const getArgument = (
  interaction: Interaction,
  argument: string
): Option | null => {
  const { options } = interaction.data;
  if (!options) return null;

  const _arg = options.filter((o) => o.name === argument);
  if (_arg.length === 1) return _arg.shift() as Option;
  else return null;
};
