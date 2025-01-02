import { SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { SlashCommandProps } from 'commandkit';
import {
  getBlooperAuthors,
  getCommandDescription,
  getMessage,
  getRandomBlooper,
} from '../../utils/json';
import { Logger } from '../../utils/misc';

const scanBloopers = getCommandDescription('scanBloopers');
const blooperAuthors = getBlooperAuthors();
const errorMsg = getMessage('error');

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

export const options = {
  awakeOnly: true,
};

export async function run({ interaction }: SlashCommandProps): Promise<void> {
  const author =
    interaction.options.getString(scanBloopers.options![0].name) || undefined;
  const blooper = getRandomBlooper(author);

  try {
    if (!blooper) {
      await interaction.reply({ content: errorMsg, ephemeral: true });
      return;
    }

    await interaction.reply(
      `"${blooper.message}" ~ ${blooper.alias}. ${blooper.date}.`,
    );
  } catch (err) {
    Logger.error('slash', 'perolasdoservidor', err);
  }
}
