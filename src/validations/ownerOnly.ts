import { ValidationProps } from 'commandkit';
import { ChatInputCommandInteraction } from 'discord.js';
import { getMessage } from '../utils/json';
import { devs } from '../config.json';

const guildOnly = getMessage('guildOnly');
const ownerOnly = getMessage('ownerOnly');

export default function ({
  interaction,
  commandObj,
}: ValidationProps): boolean {
  interaction = interaction as ChatInputCommandInteraction;
  if (!interaction.guildId) {
    interaction.reply({ content: guildOnly, ephemeral: true });
    return true;
  }
  if (!commandObj.options?.ownerOnly) return false;
  if (interaction.user.id === devs[0]) return false;
  interaction.reply({ content: ownerOnly, ephemeral: true });
  return true;
}
