import { getEmojiArray } from '../../utils/json';
import type {
  CheckMessageContentOptions,
  MessageCreateEventFn,
} from '../../types';
import {
  checkMessageContent,
  normal,
  sendTextMessage,
  shouldSendMessage,
} from '../../utils/content';

const sendEmoji: MessageCreateEventFn = async message => {
  if (!shouldSendMessage(message.author, message.content, message.channelId))
    return;
  const content = message.content;
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
      await sendTextMessage(message, emoji.id, { answerTimeout });
      break;
    }
  }
};

export default sendEmoji;
