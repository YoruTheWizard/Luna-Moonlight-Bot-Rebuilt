import {
  CacheType,
  ChatInputCommandInteraction,
  TextBasedChannel,
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
      await interaction.deferReply({ ephemeral: true });
      const guild = interaction.guild;
      if (!guild) return;

      const newChannel = interaction.options.getChannel(
        welcomeConfig.options![0].name,
      ) as TextBasedChannel;

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
      await interaction.editReply(welcomeMsg.register);
    } catch (err) {
      ErrorLogger.slash('welcomechannel configure', err);
    }
  };
}
