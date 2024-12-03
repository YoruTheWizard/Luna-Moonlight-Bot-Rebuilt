import { MessageCreateEventFn } from '../../types';
import { AIConfig } from '../../config.json';
import MessageCache from '../../utils/AI/MessageCache';
import messageToJSON from '../../utils/AI/messageToJSON';
import { Logger } from '../../utils';
import GoogleAI from '../../services/GoogleAI';
import getChannelHistory from '../../utils/AI/getChannelHistory';

const sendAIResponse: MessageCreateEventFn = async (message, client, h) => {
  if (message.channel.id !== AIConfig.guild.channel) return;
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) {
    MessageCache.push({ text: messageToJSON(message, client.user.id) });
    return;
  }

  try {
    await message.channel.sendTyping();
    const content = messageToJSON(message, client.user.id);
    const cached = MessageCache.messages;

    const chat = await GoogleAI.getChat();
    if (!chat) {
      Logger.error('event', 'getting AI Response', 'Chat not started');
      return;
    }

    const history = await getChannelHistory(client);
    const lastContent = history[history.length - 1];
    const msg = lastContent
      ? lastContent.role === 'model'
        ? content
        : [...lastContent.parts, ...cached, { text: content }]
      : [{ text: content }];

    const result = await chat.sendMessage(msg);
    const response = result.response.text();

    // Testing for messages longer than 2000 characters
    if (response.length > 2000) {
      const respArray = response.match(/[\s\S]{1,2000}/g)!;
      respArray.forEach(async resp => {
        await message.reply(resp);
      });
      return;
    }

    return await message.reply(response);
  } catch (err) {
    Logger.error('event', 'getting AI Response', err);
    sendAIResponse(message, client, h);
  }
};

export default sendAIResponse;
