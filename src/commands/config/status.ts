import { PresenceStatusData, SlashCommandBuilder } from 'discord.js';
import { getCommandDescription } from '../../json';
import { CommandOptions, SlashCommandProps } from 'commandkit';
import { Logger } from '../../utils';

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

    client.user.setStatus(statusType);

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
        statusTranslated = 'invisível';
        break;
      default:
        statusTranslated = 'disponível';
    }

    await interaction.reply({
      content: `Status alterado para "${statusTranslated}".`,
      ephemeral: true,
    });
  } catch (err) {
    Logger.error('slash', 'slash', err);
  }
};
