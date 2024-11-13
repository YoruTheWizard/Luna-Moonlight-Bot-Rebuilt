import { Client, TextBasedChannel } from 'discord.js';
import { AIConfig } from '../../config.json';
import messageToJSON from './messageToJSON';
import { Content } from '@google/generative-ai';

export default async function getChannelHistory(client: Client<true>) {
  const server = client.guilds.cache.get(AIConfig.guild.id);
  const channel = server?.channels.cache.get(AIConfig.guild.channel) as
    | TextBasedChannel
    | undefined;
  if (!channel) return []; // If channel does not exist, return empty array

  // Get last 50 messages in channel
  const messages = await channel.messages.fetch({ limit: 50 });
  // Filter messages
  const filtered = messages
    .reverse()
    .filter(msg => !msg.author.bot || msg.author.id === client.user.id)
    .map<Content>(msg => {
      return {
        role: msg.author.bot ? 'model' : 'user',
        parts: [
          {
            text: msg.author.bot
              ? msg.content
              : messageToJSON(msg, client.user.id),
          },
        ],
      };
    });

  return new Promise<Content[]>((resolve, reject) => {
    const history: Content[] = [];
    if (!filtered.length) resolve([]);
    filtered.forEach((c, i) => {
      if (!history.length) history.push(c);
      else {
        const lastContent = history[history.length - 1];
        if (lastContent.role === 'model' || c.role === 'model') history.push(c);
        else history[history.length - 1].parts.push(...c.parts);
      }
      if (i === filtered.length - 1) resolve(history);
    });
  });
}
