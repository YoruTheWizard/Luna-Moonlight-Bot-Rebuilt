import { getNickname } from '../../json';
import { MessageCreateEventFn } from '../../types';
import {
  checkMessageContent,
  getCurrentMoment,
  messageIntoArray,
  sendTextMessage,
  shouldSendMessage,
} from '../../utils';

const sendGreeting: MessageCreateEventFn = async message => {
  if (!shouldSendMessage(message.author)) return;
  const msg = messageIntoArray(message.content);
  const user = getNickname(message.author.id) || message.author.displayName;
  const username = typeof user === 'string' ? user : user.nickname;
  const polite = typeof user === 'string' ? true : user.polite;
  const now = getCurrentMoment();
  let reply: string = '';

  if (!msg.some(i => ['luna', 'luninha'].includes(i))) return;
  if (msg.length <= 1) return;

  const greet = ['bom', 'boa', 'bah', 'good', 'buenos', 'buenas'];

  // GOOD MORNING
  if (
    msg.some(i => ['bodia', 'ohayou', 'ohayo'].includes(i)) ||
    checkMessageContent({
      message: message.content,
      content: [greet, ['dia', 'morning', 'day', 'días', 'dias']],
    })
  ) {
    if (now === 'night') reply = '*Mas já está de noite...*';
    else reply = `Bom dia, **${username}**!`;
  }

  // GOOD AFTERNOON
  else if (
    msg.includes('botarde') ||
    checkMessageContent({
      message: message.content,
      content: [greet, ['tarde', 'afternoon', 'tardes']],
    })
  ) {
    if (now === 'morning') reply = '*Mas ainda é manhã...*';
    else if (now === 'night') reply = '*Mas já está de noite...*';
    else reply = `Boa tarde, **${username}**!`;
  }

  // GOOD EVENING/NIGHT
  else if (
    msg.some(i =>
      ['bonoite', 'oyasumi', 'oyasuminasai', 'konbanwa'].includes(i),
    ) ||
    checkMessageContent({
      message: message.content,
      content: [greet, ['noite', 'night', 'evening', 'noches']],
    })
  ) {
    if (now !== 'night') reply = '*Mas ainda nem é noite...*';
    else reply = `Boa noite, **${username}**!`;
  }

  // HELLO
  else if (
    msg.some(i => ['olá', 'ola', 'oi', 'konnichiwa', "kon'nichiwa"].includes(i))
  ) {
    reply = `${polite ? 'Olá' : 'Oi'}, **${username}**!`;
  }

  // HOW ARE YOU
  if (
    reply &&
    (msg.some(i => ['ogenki', 'genki'].includes(i)) ||
      checkMessageContent({
        message: message.content,
        content: [['como'], ['está', 'esta', 'vai']],
      }))
  )
    reply = reply + ' Estou bem, e você?';

  if (reply)
    return sendTextMessage({
      messageObj: message,
      content: reply,
    });
};

export default sendGreeting;
