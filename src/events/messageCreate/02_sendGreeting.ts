import { getNickname } from '../../json';
import { MessageCreateEventFn } from '../../types';
import {
  checkMessageContent,
  getCurrentMoment,
  messageIntoArray,
  normal,
  sendTextMessage,
  shouldSendMessage,
} from '../../utils';

const sendGreeting: MessageCreateEventFn = async message => {
  if (!shouldSendMessage(message.author, message.content, message.channelId))
    return;
  const msg = messageIntoArray(message.content);
  const user = getNickname(message.author.id) || message.author.displayName;
  const username = typeof user === 'string' ? user : user.nickname;
  const polite = typeof user === 'string' ? true : user.polite;
  const now = getCurrentMoment();
  let reply: string = '';

  if (
    !msg.some(i =>
      ['luna', 'luninha'].includes(i.includes('-') ? i.split('-')[0] : i),
    )
  )
    return;
  if (!msg.length) return;

  const greet = ['bom', 'boa', 'bah', 'good', 'buenos', 'buenas'];

  // HELLO
  if (
    msg.some(i =>
      [normal('olá'), 'ola', 'oi', 'konnichiwa', "kon'nichiwa"].includes(i),
    )
  ) {
    reply = `${polite ? 'Olá' : 'Oi'}, **${username}**!`;
  }

  // GOOD MORNING
  if (
    msg.some(i => ['bodia', 'ohayou', 'ohayo', normal('ohayō')].includes(i)) ||
    checkMessageContent(message.content, [
      greet,
      ['dia', 'morning', 'day', normal('días'), 'dias'],
    ])
  ) {
    if (now === 'night') reply = '*Mas já está de noite...*';
    else reply = `Bom dia, **${username}**!`;
  }

  // GOOD AFTERNOON
  if (
    msg.includes('botarde') ||
    checkMessageContent(message.content, [
      greet,
      ['tarde', 'afternoon', 'tardes'],
    ])
  ) {
    if (!reply) {
      if (now === 'morning') reply = '*Mas ainda é manhã...*';
      else if (now === 'night') reply = '*Mas já está de noite...*';
      else reply = `Boa tarde, **${username}**!`;
    } else if (reply.includes('dia') && now === 'afternoon')
      reply = `Boa tarde, **${username}**!`;
  }

  // GOOD EVENING/NIGHT
  if (
    msg.some(i =>
      ['bonoite', 'oyasumi', 'oyasuminasai', 'konbanwa', "konban'wa"].includes(
        i,
      ),
    ) ||
    checkMessageContent(message.content, [
      greet,
      ['noite', 'night', 'evening', 'noches'],
    ])
  ) {
    if (!reply || reply.includes('...')) {
      if (now !== 'night') reply = '*Mas ainda nem é noite...*';
      else reply = `Boa noite, **${username}**!`;
    }
  }

  // HOW ARE YOU
  if (
    reply &&
    (msg.some(i => ['ogenki', 'genki'].includes(i)) ||
      checkMessageContent(message.content, [
        ['como'],
        [normal('está'), 'esta', 'vai'],
      ]))
  )
    reply = reply + ' Estou bem, e você?';

  if (reply) return sendTextMessage(message, reply);
};

export default sendGreeting;
