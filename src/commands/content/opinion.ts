import { SlashCommandBuilder } from 'discord.js';
import {
  getCommandDescription,
  getEmoji,
  getMessage,
  getNickname,
  getRandomAdjective,
  isDad,
} from '../../json';
import { SlashCommandProps } from 'commandkit';
import { Logger } from '../../utils';

const opinion = getCommandDescription('lunasOpinion');
const message = getMessage('opinion');
const guildOnly = getMessage('guildOnly');
const userNotFound = getMessage('userNotFound');

export const data = new SlashCommandBuilder()
  .setName(opinion.name)
  .setDescription(opinion.description)
  .addUserOption(opt =>
    opt
      .setName(opinion.options![0].name)
      .setDescription(opinion.options![0].description),
  );

// export const options = {};

export async function run({
  interaction,
  client,
}: SlashCommandProps): Promise<void> {
  const personId =
    interaction.options.getUser(opinion.options![0].name)?.id ||
    interaction.member?.user.id;
  if (!personId) return;
  try {
    if (!interaction.guild) {
      await interaction.reply({ content: guildOnly, ephemeral: true });
      return;
    }

    if (personId === client.user.id) {
      await interaction.reply(message.myself);
      return;
    }

    if (isDad(personId)) {
      await interaction.reply(
        message.dad.replace('{heart}', getEmoji('heart').id),
      );
      return;
    }

    const person = interaction.guild.members.cache.get(personId);
    if (!person) {
      await interaction.reply({ content: userNotFound, ephemeral: true });
      return;
    }

    const customNick = getNickname(personId);
    const personName = customNick?.nickname || person.displayName;

    const adjective = getRandomAdjective();
    if (adjective.adj === 'nada') {
      await interaction.reply(message.nothing.replace('{person}', personName));
      return;
    }

    await interaction.reply(
      message.sentence
        .replace('{person}', personName)
        .replace('{adj}', adjective.adj),
    );
  } catch (err) {
    Logger.error('slash', 'opiniaodaluna', err);
  }
}
