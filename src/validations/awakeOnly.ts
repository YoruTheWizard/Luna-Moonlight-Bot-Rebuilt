import { ValidationProps } from 'commandkit';
import { getEmoji, getMessage } from '../utils/json';
import { ChatInputCommandInteraction } from 'discord.js';

const sleeping = getMessage('sleeping');

export default function ({
  interaction,
  commandObj,
  client,
}: ValidationProps): boolean {
  interaction = interaction as ChatInputCommandInteraction;
  if (!commandObj.options?.awakeOnly) return false;
  if (client.user.presence.status !== 'invisible') return false;

  interaction.reply({
    content: sleeping.replace('{emoji}', getEmoji('sleeping').id),
    ephemeral: true,
  });
  return true;
}
