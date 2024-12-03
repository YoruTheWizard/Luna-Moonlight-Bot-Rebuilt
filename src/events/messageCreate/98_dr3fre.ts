import { MessageCreateEventFn } from '../../types';
import {
  checkMessageContent,
  messageIntoArray,
  sendTextMessage,
  shouldSendMessage,
} from '../../utils';

const dr3fre: MessageCreateEventFn = async message => {
  if (!shouldSendMessage(message.author, message.content, message.channelId))
    return;
  const msg = messageIntoArray(message.content);
  if (msg.includes('dr3fre'))
    sendTextMessage(message, 'Banzai!', { answerTimeout: 500 });
};

export default dr3fre;
