import { getEmojiArray } from '../../json';
import type {
  CheckMessageContentOptions,
  MessageCreateEventFn,
} from '../../types';
import {
  checkMessageContent,
  normal,
  sendTextMessage,
  shouldSendMessage,
} from '../../utils';

const sendEmoji: MessageCreateEventFn = async messageObj => {
  if (!shouldSendMessage(messageObj.author)) return;
  const content = messageObj.content;
  const answerTimeout = 100;
  // i.includes('-') ? i.split('-')[0] : i
  if (!getEmojiArray().length) return;
  for (const emoji of getEmojiArray()) {
    if (emoji.uncheckable) continue;
    // console.log(emoji);
    const normalizedTriggers = emoji.triggers!.map(c => c.map(r => normal(r)));
    const checkObj: CheckMessageContentOptions = {
      avoid: emoji.avoid,
      limit: emoji.limit,
    };
    // console.log(checkMessageContent(content, normalizedTriggers, checkObj));
    if (checkMessageContent(content, normalizedTriggers, checkObj)) {
      await sendTextMessage(messageObj, emoji.id, { answerTimeout });
      break;
    }
  }
};

export default sendEmoji;
