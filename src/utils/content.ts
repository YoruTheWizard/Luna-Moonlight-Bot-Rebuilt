import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Message,
  SlashCommandStringOption,
  TextBasedChannel,
  User,
} from 'discord.js';

import { getCommandDescription, messages, scanTitles } from '../json';
import { AIConfig } from '../config.json';
import type {
  CheckMessageContentOptions,
  ContentLinkObject,
  EmbedFunctionOptions,
  ScanTitle,
  SendMessageOptions,
} from '../types';

const announcement = getCommandDescription('announcement');

/**
 * `[ Content ]`
 *
 * Returns an array with the data of all the scan titles
 */
export function getAllScanTitles(): ScanTitle[] {
  return scanTitles;
}

/**
 * `[ Content ]`
 *
 * Returns the data of a scan title. If the given *id* does not match any title, returns `null`
 * @param titleId The id of the title to get
 */
export function getScanTitle(titleId: string): ScanTitle | null {
  for (const title of scanTitles) if (title.id === titleId) return title;
  return null;
}

/**
 * `[ Content ]`
 *
 * Returns the choice objects for all titles, ready for the announcement function object.
 */
export function getTitlesChoices(): { name: string; value: string }[] {
  const choices = [];
  for (const title of scanTitles)
    choices.push({
      name: title.name,
      value: title.id,
    });
  return choices;
}

/**
 * `[ Content ]`
 *
 * Sets the "title" option for the announcement function.
 * @param opt the option object
 */
export function setCommandTitleOption(
  opt: SlashCommandStringOption,
): SlashCommandStringOption {
  opt
    .setName(announcement.options![0].name)
    .setDescription(announcement.options![0].description)
    .setRequired(true);
  const choices = getTitlesChoices();
  for (const title of choices) opt.addChoices(title);
  return opt;
}

/**
 * `[ Content ]`
 *
 * Returns an array of link objects.
 * @param linksText the raw text value from the "links" option
 */
export function linkListTreater(linksText: string): ContentLinkObject[] {
  const links: ContentLinkObject[] = [];
  const splitLinks = linksText.split(', ');
  splitLinks.forEach((v, i) => {
    const link = v.split(' ');
    const linkObj: ContentLinkObject = {
      num: i + 1,
      name: link[1] ? link[1].replaceAll('-', ' ') : '',
      url: link[0],
    };
    if (link[2]) linkObj.emoji = link[2].replace(/[^0-9]/g, '');
    links.push(linkObj);
  });
  return links;
}

/**
 * `[ Content ]`
 *
 * Returns an Action Row Component of links for announcement embeds.
 * @param links the list of link objects
 */
export function linksButtonRow(links: ContentLinkObject[]) {
  const buttons: ButtonBuilder[] = [];
  for (const link of links) {
    let btn = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel(link.name)
      .setURL(link.url);
    if (link.emoji) btn = btn.setEmoji(link.emoji);
    buttons.push(btn);
  }
  return new ActionRowBuilder<ButtonBuilder>().setComponents(buttons).toJSON();
}

/**
 * `[ Content ]`
 *
 * Sends an embed message on the channel the interaction was sent.
 * @param interaction the interaction object
 * @param options function options
 */
export async function sendContentEmbeds(
  interaction: ChatInputCommandInteraction,
  options: EmbedFunctionOptions,
): Promise<void> {
  const { embeds, rows, ephemeral, role = '@everyone' } = options;
  const messageOptions = {
    content: `${role}`,
    embeds,
    components: rows,
  };
  if (ephemeral) {
    await interaction.channel?.send(messageOptions);
    interaction.reply({ content: messages.messageSent, ephemeral });
  } else interaction.reply(messageOptions);
}

/**
 * `[ Content ]`
 *
 * Gets current date in Brasilia time.
 */
export function getCurrentDate(): Date {
  const rawDateString = new Date().toLocaleString([], {
    timeZone: 'America/Sao_Paulo',
    hour12: false,
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  const [date, hour] = rawDateString.split(', ');
  const reverseDate = date.split('/').reverse().join('-');
  const dateString = `${reverseDate}T${hour}.000Z`;
  return new Date(dateString);
  // return new Date(
  //   new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
  // );
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
  if (content && isIgnore(content)) return false;
  if (channelId && channelId === AIConfig.gemini.guild.channel) return false;
  const now = getCurrentDate();
  if (now.getHours() < 6 || now.getHours() >= 22) return false;
  if (author.bot) return false;
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
