import { Client, Message } from 'discord.js';
import { getNickname } from '../../json';
import { AIConfig } from '../../config.json';

export default function messageToJSON(
  message: Message<boolean>,
  clientId: string,
) {
  const nickObj = getNickname(message.author.id);
  return `{"userId":"${message.author.id}","userName":"${message.author.displayName}",${nickObj ? `"nickname":"${nickObj.nickname}",` : ''}"message":"${message.content.replace(`<@${clientId}>`, AIConfig.botName)}"}`;
}
