import {
  CacheType,
  ChatInputCommandInteraction,
  GuildBasedChannel,
} from 'discord.js';
import { ErrorLogger } from './errorLogger';
import { getCommandDescription, getMessage } from '../json';
import { welcomeOn } from '../config.json';
import { updateConfig } from './updateConfig';

type WelcomeFunc = (
  interaction: ChatInputCommandInteraction<CacheType>,
) => Promise<void>;
const welcomeConfig = getCommandDescription('welcomechannel_configure');
const welcomeMsg = getMessage('welcomeConfig');

export abstract class WelcomeChannel {
  static register: WelcomeFunc = async interaction => {
    try {
      await interaction.deferReply();
      const guild = interaction.guild;
      if (!guild) return;

      const newChannel = interaction.options.getChannel(
        welcomeConfig.options![0].name,
      ) as GuildBasedChannel;

      for (const objI in welcomeOn) {
        const obj = welcomeOn[objI];
        if (obj.server === guild.id) {
          if (obj.channel === newChannel.id) {
            await interaction.editReply(welcomeMsg.channelExists);
            return;
          }

          welcomeOn[objI].channel = newChannel.id;
          updateConfig('welcomeOn', welcomeOn);
          await interaction.editReply(welcomeMsg.edit);
          return;
        }
      }

      welcomeOn.push({
        server: guild.id,
        channel: newChannel.id,
      });
      updateConfig('welcomeOn', welcomeOn);
      const msg = welcomeMsg.register.replace('{newChannel}', newChannel.name);
      await interaction.editReply(msg);
    } catch (err) {
      ErrorLogger.slash('welcomechannel configure', err);
    }
  };
  static erase: WelcomeFunc = async interaction => {
    try {
      await interaction.deferReply();
      const guild = interaction.guild;
      if (!guild) return;

      for (const obj of welcomeOn) {
        if (obj.server === guild.id) {
          const i = welcomeOn.indexOf(obj);
          welcomeOn.splice(i, 1);

          updateConfig('welcomeOn', welcomeOn);
          await interaction.editReply(welcomeMsg.disable);
          return;
        }
      }

      await interaction.editReply(welcomeMsg.notEnabled);
    } catch (err) {
      ErrorLogger.slash('welcomechannel disable', err);
    }
  };

  static display: WelcomeFunc = async interaction => {
    try {
      await interaction.deferReply();
      const guild = interaction.guild;
      if (!guild) return;

      let channelId: string | undefined;
      for (const obj of welcomeOn)
        if (obj.server === guild.id) channelId = obj.channel;

      if (!channelId) {
        await interaction.editReply(welcomeMsg.notEnabled);
        return;
      }

      const channel = guild.channels.cache.get(channelId)!;
      const msg = welcomeMsg.info
        .replace('{guild}', guild.name)
        .replace('{channel}', channel.name);
      await interaction.editReply(msg);
    } catch (err) {
      ErrorLogger.slash('welcomeconfig info', err);
    }
  };
}
