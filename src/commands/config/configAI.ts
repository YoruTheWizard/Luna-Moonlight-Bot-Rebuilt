import { CommandOptions, SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder } from 'discord.js';
import { getCommandDescription, getMessage } from '../../utils/json';
import Luna from '../../utils/Luna';
import getChannelHistory from '../../utils/AI/getChannelHistory';
import GoogleAI from '../../services/AI/GoogleAI';
import { Logger, cf } from '../../utils/misc';

const lunaai = getCommandDescription('lunaai');
const lunaai_turnon = getCommandDescription('lunaai_turnon');
const lunaai_turnoff = getCommandDescription('lunaai_turnoff');
const lunaai_restart = getCommandDescription('lunaai_restart');

const messages = getMessage('lunaAIConfig');

export const data = new SlashCommandBuilder()
  .setName(lunaai.name)
  .setDescription(lunaai.description)

  // "Turn on" subcommand
  .addSubcommand(sub =>
    sub.setName(lunaai_turnon.name).setDescription(lunaai_turnon.description),
  )

  // "Turn off" subcommand
  .addSubcommand(sub =>
    sub.setName(lunaai_turnoff.name).setDescription(lunaai_turnoff.description),
  )

  // "Restart"
  .addSubcommand(sub =>
    sub.setName(lunaai_restart.name).setDescription(lunaai_restart.description),
  );

export const options: CommandOptions = {
  devOnly: true,
};

export const run = async ({ interaction, client }: SlashCommandProps) => {
  const subcommand = interaction.options.getSubcommand();
  try {
    await interaction.deferReply({ ephemeral: true });

    const history =
      subcommand !== lunaai_turnoff.name
        ? await getChannelHistory(client)
        : undefined;

    switch (subcommand) {
      case lunaai_turnon.name:
        if (Luna.isAIOn) return await interaction.editReply(messages.isOn);
        await GoogleAI.init(history);
        Luna.isAIOn = true;
        Logger.log(`Luna AI ${cf.fg}on${cf.r}`);
        return await interaction.editReply(messages.turnOn);
      case lunaai_turnoff.name:
        if (!Luna.isAIOn) return await interaction.editReply(messages.isOff);
        Luna.isAIOn = false;
        Logger.log(`Luna AI ${cf.fr}off${cf.r}`);
        return await interaction.editReply(messages.turnOff);
      case lunaai_restart.name:
        await GoogleAI.init(history);
        Logger.log(`Luna AI ${cf.b}restarted${cf.r}`);
        return await interaction.editReply(messages.restart);
    }
  } catch (err) {
    Logger.error('slash', `lunaai ${subcommand}`, err);
  }
};
