import { SlashCommandBuilder } from 'discord.js';
import { getCommandDescription } from '../../json';
import { CommandOptions, SlashCommandProps } from 'commandkit';
import { restart } from '../../utils';

const restartCmd = getCommandDescription('restart');

export const data = new SlashCommandBuilder()
  .setName(restartCmd.name)
  .setDescription(restartCmd.description);

export const options: CommandOptions = {
  devOnly: true,
};

export const run = async ({
  interaction,
  client,
}: SlashCommandProps): Promise<void> => {
  await interaction.reply({ content: 'Boa noite...', ephemeral: true });
  return await restart(interaction.channel!, client);
};
