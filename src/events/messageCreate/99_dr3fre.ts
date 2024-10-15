import { MessageCreateEventFn } from '../../types';
import {
  checkMessageContent,
  messageIntoArray,
  sendTextMessage,
  shouldSendMessage,
} from '../../utils';

const dr3fre: MessageCreateEventFn = async messageObj => {
  if (!shouldSendMessage(messageObj.author)) return;
  const msg = messageIntoArray(messageObj.content);
  if (msg.includes('dr3fre'))
    sendTextMessage({
      messageObj,
      content: 'Banzai!',
      answerTimeout: 500,
    });
};

export default dr3fre;
