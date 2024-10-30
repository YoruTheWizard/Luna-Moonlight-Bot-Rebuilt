import { SlashCommandBuilder } from 'discord.js';
import {
  getCommandDescription,
  getMessage,
  getRandomAdjective,
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

export async function run({ interaction }: SlashCommandProps): Promise<void> {
  const personId =
    interaction.options.getUser(opinion.options![0].name)?.id ||
    interaction.member?.user.id;
  if (!personId) return;
  try {
    if (!interaction.guild) {
      await interaction.reply({ content: guildOnly, ephemeral: true });
      return;
    }

    if (personId === interaction.guild!.members.me!.id) {
      await interaction.reply(message.myself);
      return;
    }

    const person = interaction.guild.members.cache.get(personId);
    if (!person) {
      await interaction.reply({ content: userNotFound, ephemeral: true });
      return;
    }

    const adjective = getRandomAdjective();
    if (adjective.adj === 'nada') {
      await interaction.reply(
        message.nothing.replace('{person}', person.displayName),
      );
      return;
    }

    await interaction.reply(
      message.sentence
        .replace('{person}', person.displayName)
        .replace('{adj}', adjective.adj),
    );
  } catch (err) {
    Logger.error('slash', 'opiniaodaluna', err);
  }
}
