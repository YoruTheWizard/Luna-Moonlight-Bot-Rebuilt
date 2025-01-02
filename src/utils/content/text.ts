import { Message, User } from 'discord.js';
import { CheckMessageContentOptions, SendMessageOptions } from '../../types';
import { AIConfig, timezoneOffset } from '../../config.json';
import Luna from '../Luna';

/**
 * `[ Content ]`
 *
 * Gets current date in Brasilia time.
 */
export function getCurrentDate(): Date {
  const rawDateString = new Date().toLocaleString('pt-br', {
    timeZone: 'America/Sao_Paulo',
    hour12: false,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const [date, hour] = rawDateString.split(', ');
  const reverseDate = date.split('/').reverse().join('-');
  const dateString = `${reverseDate}T${hour}.000${timezoneOffset}:00`;
  return new Date(dateString);
}

/**
 * `[ Content ]`
 *
 * Gets current period of the day.
 */
export function getCurrentMoment(): 'morning' | 'afternoon' | 'night' {
  const now = getCurrentDate();
  if (now.getHours() >= 5 && now.getHours() < 12) return 'morning';
  if (now.getHours() < 18) return 'afternoon';
  return 'night';
}

/**
 * `[ Content ]`
 *
 * Splits a message into an array of strings, normalizing and ignoring certain symbols.
 * @param message the message to split
 */
export function messageIntoArray(message: string): string[] {
  const regexp = /[?!,;\.\:\\\/\(\)\[\]\{\}]/g;
  return message
    .normalize('NFD')
    .toLowerCase()
    .replace(regexp, '')
    .split(/\s+/)
    .map(w => {
      if (w.includes('luna') && w.includes('-')) return w.split('-')[0];
      return w;
    });
}

/**
 * `[ Content ]`
 *
 * Returns `true` if the message contains the given content, otherwise returns `false`.
 * If given "avoid" value, returns `false` if the message contain at least one of them.
 * If given "limit" value, returns `false` if the message is longer than de limit.
 * @param options function options
 */
export function checkMessageContent(
  message: string,
  content: string[][],
  options?: CheckMessageContentOptions,
): boolean {
  const limit = options?.limit;
  const avoid = options?.avoid;
  const msg = messageIntoArray(message);
  if (limit && msg.length > limit) return false;
  if (avoid && msg.some(i => avoid.includes(i))) return false;

  return content.every(row => msg.some(i => row.includes(i)));
}

/**
 * `[ Content ]`
 *
 * Sends a text message.
 * @param options function options
 */
export async function sendTextMessage(
  messageObj: Message<true>,
  content: any,
  options?: SendMessageOptions,
): Promise<void> {
  const typingTimeout = options?.typingTimeout || 1000;
  const answerTimeout = options?.answerTimeout || content.length * 100;
  const reply = options?.reply !== undefined ? options.reply : true;

  return new Promise<void>(resolve => {
    setTimeout(() => {
      messageObj.channel.sendTyping();
    }, typingTimeout);
    setTimeout(async () => {
      if (reply) await messageObj.reply(content);
      else await messageObj.channel.send(content);
      resolve();
    }, typingTimeout + answerTimeout);
  });
}

/**
 * `[ Content ]`
 *
 * Checks if some message should be responded.
 *
 * @param author the user who sent the message
 * @param content content of the message (optional)
 * @param channelId id of the channel in which the message was sent
 */
export function shouldSendMessage(
  author: User,
  content?: string,
  channelId?: string,
): boolean {
  if (author.bot) return false;
  if (Luna.isAsleep) return false;
  if (channelId && channelId === AIConfig.gemini.guild.channel) return false;
  if (content && isIgnore(content)) return false;
  return true;
}

/**
 * `[ Content ]`
 *
 * Normalizes texts with special characters to compare with treated messages.
 *
 * (Note: always use it when writing text with accented characters)
 * @param text text to normalize
 */
export function normal(text: string): string {
  return text.normalize('NFD');
}

/**
 * `[ Content ]`
 *
 * Checks whether message should be ignored or not.
 *
 * @param msg Message to check
 */
export function isIgnore(msg: string): boolean {
  const filtered = msg
    .substring(0, 50)
    .toLowerCase()
    .replaceAll(/[*_~|]/g, '');
  return ['!lunaignore', '!lunaig', '!ignore', '!ig'].some(t =>
    filtered.startsWith(t),
  );
}
