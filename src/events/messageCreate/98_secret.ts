import { MessageCreateEventFn } from '../../types';
import {
  messageIntoArray,
  sendTextMessage,
  shouldSendMessage,
} from '../../utils/content';
import { secretMessage } from '../../config.json';

const secret: MessageCreateEventFn = async message => {
  if (!shouldSendMessage(message.author, message.content, message.channelId))
    return;
  const msg = messageIntoArray(message.content);
  if (msg.includes(secretMessage))
    sendTextMessage(message, 'Banzai!', { answerTimeout: 500 });
};

export default secret;
