import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { SlashCommandProps } from 'commandkit';
import {
  getBlooperAuthors,
  getCommandDescription,
  getRandomBlooper,
} from '../../json';
import { ErrorLogger } from '../../utils';

const scanBloopers = getCommandDescription('scanBloopers');
const blooperAuthors = getBlooperAuthors();

const setAuthorOption = (
  opt: SlashCommandStringOption,
): SlashCommandStringOption => {
  const authorOption = scanBloopers.options![0];
  opt.setName(authorOption.name).setDescription(authorOption.description);
  for (const author of blooperAuthors)
    opt.addChoices({ name: author, value: author });
  return opt;
};

export const data = new SlashCommandBuilder()
  .setName(scanBloopers.name)
  .setDescription(scanBloopers.description)
  .addStringOption(opt => setAuthorOption(opt));

// export const options = {};

export async function run({ interaction }: SlashCommandProps): Promise<void> {
  const author =
    interaction.options.getString(scanBloopers.options![0].name) || undefined;
  const blooper = getRandomBlooper(author);
  if (!blooper) return;

  try {
    await interaction.reply(
      `"${blooper.message}" ~ ${blooper.alias}. ${blooper.date}.`,
    );
  } catch (err) {
    ErrorLogger.slash('perolasdoservidor', err);
  }
}
