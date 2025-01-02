import { PresenceStatusData, SlashCommandBuilder } from 'discord.js';
import { getCommandDescription } from '../../utils/json';
import { CommandOptions, SlashCommandProps } from 'commandkit';
import { Logger } from '../../utils/misc';
import { status as configStatus } from '../../config.json';
import Luna from '../../utils/Luna';

const status = getCommandDescription('status');

export const data = new SlashCommandBuilder()
  .setName(status.name)
  .setDescription(status.description)

  // "status" option
  .addStringOption(opt =>
    opt
      .setName(status.options![0].name)
      .setDescription(status.options![0].description)
      .addChoices(...status.options![0].choices!)
      .setRequired(true),
  );

export const options: CommandOptions = {
  devOnly: true,
};

export const run = async ({
  interaction,
  client,
}: SlashCommandProps): Promise<void> => {
  try {
    const statusType = interaction.options.getString(
      status.options![0].name,
      true,
    ) as PresenceStatusData;

    let statusTranslated: string;
    switch (statusType) {
      case 'online':
        statusTranslated = 'disponível';
        break;
      case 'idle':
        statusTranslated = 'ausente';
        break;
      case 'dnd':
        statusTranslated = 'não perturbe';
        break;
      case 'invisible':
        Luna.isAIOn = false;
        Luna.isAsleep = true;
        statusTranslated = 'invisível';
        break;
      default:
        statusTranslated = 'disponível';
    }

    if (statusType === configStatus) {
      await interaction.reply({
        content: `Status já é "${statusTranslated}"!`,
        ephemeral: true,
      });
      return;
    }

    client.user.setStatus(statusType);
    if (Luna.isAsleep && statusType !== 'invisible') {
      Luna.isAIOn = true;
      Luna.isAsleep = false;
    }

    await interaction.reply({
      content: `Status alterado para "${statusTranslated}".`,
      ephemeral: true,
    });
  } catch (err) {
    Logger.error('slash', 'slash', err);
  }
};
