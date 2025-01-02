import { MessageCreateEventFn } from '../../types';
import { AIConfig } from '../../config.json';
import MessageCache from '../../utils/AI/MessageCache';
import messageToJSON from '../../utils/AI/messageToJSON';
import { Logger } from '../../utils/misc';
import GoogleAI from '../../services/AI/GoogleAI';
import getChannelHistory from '../../utils/AI/getChannelHistory';
import { isGeneratedImage, useFunction } from '../../utils/AI/functions';
import { AttachmentBuilder } from 'discord.js';
import { timeout } from '../../utils/misc';
import Luna from '../../utils/Luna';
import { isIgnore } from '../../utils/content';

const sendAIResponse: MessageCreateEventFn = async (message, client, h) => {
  if (message.channel.id !== AIConfig.gemini.guild.channel) return;
  if (message.author.bot) return;
  if (isIgnore(message.content)) return;
  if (!message.mentions.has(client.user)) {
    MessageCache.push({ text: messageToJSON(message, client.user.id) });
    return;
  }
  if (!Luna.isAIOn) return;
  if (GoogleAI.isCooldown) return;

  try {
    await timeout(2000); // "Reading timeout"
    await message.channel.sendTyping();
    const content = messageToJSON(message, client.user.id);
    let attachment = message.attachments.entries().next().value?.[1];
    if (!attachment?.contentType?.startsWith('image')) attachment = undefined;
    const file =
      attachment &&
      (await fetch(attachment.url).then(resp => resp.arrayBuffer()));

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
        ? [{ text: content }]
        : [...lastContent.parts, ...cached, { text: content }]
      : [{ text: content }];
    if (attachment?.contentType && file)
      msg.splice(msg.length - 2, 0, {
        inlineData: {
          data: Buffer.from(file).toString('base64'),
          mimeType: attachment.contentType,
        },
      });

    const result = await chat.sendMessage(msg);
    const response = result.response.text();
    const functionCall = result.response.functionCalls()?.[0];

    // Testing for messages longer than 2000 characters
    if (functionCall?.name !== 'getCurrentDate') {
      if (response.length > 2000) {
        const respArray = response.match(/[\s\S]{1,2000}/g)!;
        respArray.forEach(async resp => {
          await message.reply(resp);
        });
      } else await message.reply(response);
    }

    if (functionCall) {
      GoogleAI.isCooldown = true;
      // Calling function
      const data = await useFunction(functionCall.name, functionCall.args);
      if (!data) return;
      await message.channel.sendTyping();

      // Sending function response to AI
      const fcResult = await chat.sendMessage([
        {
          functionResponse: {
            name: functionCall.name,
            response: data,
          },
        },
      ]);
      const fcResponse = fcResult.response.text();

      // Testing for messages longer than 2000 characters
      if (fcResponse.length > 2000) {
        const respArray = fcResponse.match(/[\s\S]{1,2000}/g)!;
        respArray.forEach(async resp => {
          await message.reply({
            content: resp,
            files:
              isGeneratedImage(data) && data
                ? [new AttachmentBuilder(data.image.url, { name: 'image.png' })]
                : undefined,
          });
        });
      } else
        await message.reply({
          content: fcResponse,
          files:
            isGeneratedImage(data) && data
              ? [new AttachmentBuilder(data.image.url, { name: 'image.png' })]
              : undefined,
        });
      GoogleAI.isCooldown = false;
    }
  } catch (err) {
    Logger.error('event', 'getting AI Response', err);
  }
};

export default sendAIResponse;
