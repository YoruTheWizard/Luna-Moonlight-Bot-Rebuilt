import { Message } from 'discord.js';
import { getNickname } from '../json';
import { AIConfig } from '../../config.json';

export default function messageToJSON(
  message: Message<boolean>,
  clientId: string,
) {
  const nickObj = getNickname(message.author.id);
  return JSON.stringify({
    userId: message.author.id,
    userName: message.author.displayName,
    relation: nickObj?.relation || undefined,
    nickname: nickObj?.nickname || undefined,
    message: message.content.replace(`<@${clientId}>`, AIConfig.gemini.botName),
  });
}
