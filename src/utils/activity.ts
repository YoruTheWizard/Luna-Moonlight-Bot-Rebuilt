import { ActivityType, ChatInputCommandInteraction, Client } from 'discord.js';
import { getCommandDescription } from '../json';
import { updateConfig } from './updateConfig';
import { Logger } from './logger';

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
      let actType;
      switch (type) {
        case 'playing':
          actType = ActivityType.Playing;
          break;
        case 'watching':
          actType = ActivityType.Watching;
          break;
        case 'listening':
          actType = ActivityType.Listening;
          break;
        case 'streaming':
          actType = ActivityType.Streaming;
      }
      client.user.setActivity({ type: actType, name: text });
      await updateConfig('activity', { text, type });
      Logger.success(
        `Changed bot activity to: "${type.toUpperCase()} ${text}".`,
      );
      await interaction.reply({
        content: `Atividade alterada para "**${type.toUpperCase()}** ${text}"`,
        ephemeral: true,
      });
    } catch (err) {
      Logger.error('slash', 'atividade configurar', err);
    }
  };

  static clear: ActivityFn = async (interaction, client) => {
    try {
      client.user.setPresence({ activities: [] });
      await updateConfig('activity', { text: '', type: '' });
      Logger.success('Cleared bot activity');
      await interaction.reply({
        content: `Atividade apagada`,
        ephemeral: true,
      });
    } catch (err) {
      Logger.error('slash', 'atividade limpar', err);
    }
  };
}
