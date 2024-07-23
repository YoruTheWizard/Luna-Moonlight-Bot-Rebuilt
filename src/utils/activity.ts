import { ChatInputCommandInteraction, Client } from 'discord.js';
import { getCommandDescription } from '../json';
import { updateConfig } from './updateConfig';
import { ErrorLogger } from './errorLogger';
import { restart } from './restart';

const activitySet = getCommandDescription('activity_set');

type ActivityFn = (
  interaction: ChatInputCommandInteraction,
  client: Client<true>,
) => Promise<void>;

export abstract class Activity {
  static set: ActivityFn = async (interaction, client) => {
    const type = interaction.options.getString(
      activitySet.options![0].name,
      true,
    );
    const text = interaction.options.getString(
      activitySet.options![1].name,
      true,
    );

    try {
      updateConfig('activity', { text, type });
      console.log(`Changed bot activity to: "${type.toUpperCase()} ${text}".`);
      await interaction.reply({
        content: `Atividade alterada para "**${type.toUpperCase()}** ${text}"`,
        ephemeral: true,
      });
      await restart(interaction.channel!, client);
    } catch (err) {
      ErrorLogger.slash('atividade configurar', err);
    }
  };

  static clear: ActivityFn = async (interaction, client) => {
    try {
      updateConfig('activity', { text: '', type: '' });
      console.log(`Cleared bot activity`);
      await interaction.reply({
        content: `Atividade apagada`,
        ephemeral: true,
      });
      await restart(interaction.channel!, client);
    } catch (err) {
      ErrorLogger.slash('atividade limpar', err);
    }
  };
}
