import { getEmojiArray } from '../../json';
import type {
  CheckMessageContentOptions,
  MessageCreateEventFn,
} from '../../types';
import {
  checkMessageContent,
  sendTextMessage,
  shouldSendMessage,
} from '../../utils';

const sendEmoji: MessageCreateEventFn = async messageObj => {
  if (!shouldSendMessage(messageObj.author)) return;
  const content = messageObj.content;
  const answerTimeout = 100;

  for (const emoji of getEmojiArray()) {
    if (emoji.uncheckable) continue;
    // console.log(emoji);
    const checkObj: CheckMessageContentOptions = {
      message: content,
      content: emoji.triggers!,
      avoid: emoji.avoid,
      limit: emoji.limit,
    };
    // console.log(checkMessageContent(checkObj));
    if (checkMessageContent(checkObj)) {
      await sendTextMessage({ messageObj, content: emoji.id, answerTimeout });
      break;
    }
  }
};

export default sendEmoji;
