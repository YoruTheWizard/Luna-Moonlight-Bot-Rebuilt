import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandStringOption,
  User,
} from 'discord.js';

import { getCommandDescription, messages, scanTitles } from '../json';
import type {
  CheckMessageContentOptions,
  ContentLinkObject,
  EmbedFunctionOptions,
  ScanTitle,
  SendMessageOptions,
} from '../types';

const announcement = getCommandDescription('announcement');

/**
 * Returns an array with the data of all the scan titles
 */
export function getAllScanTitles(): ScanTitle[] {
  return scanTitles;
}

/**
 * Returns the data of a scan title. If the given *id* does not match any title, returns `null`
 * @param titleId The id of the title to get
 */
export function getScanTitle(titleId: string): ScanTitle | null {
  for (const title of scanTitles) if (title.id === titleId) return title;
  return null;
}

export function getTitlesChoices(): { name: string; value: string }[] {
  const choices = [];
  for (const title of scanTitles)
    choices.push({
      name: title.name,
      value: title.id,
    });
  return choices;
}

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

export function getCurrentDate(): Date {
  return new Date(
    new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
  );
}

export function getCurrentMoment(): 'morning' | 'afternoon' | 'night' {
  const now = getCurrentDate();
  if (now.getHours() >= 5 && now.getHours() < 12) return 'morning';
  if (now.getHours() < 18) return 'afternoon';
  return 'night';
}

export function messageIntoArray(message: string): string[] {
  const regexp = /[?!,;\.\:\\\/\(\)\[\]\{\}]/g;
  return message
    .normalize('NFD')
    .toLowerCase()
    .replace(regexp, '')
    .split(/\s+/);
}

export function checkMessageContent(
  options: CheckMessageContentOptions,
): boolean {
  const { message, content, avoid, limit } = options;
  const msg = messageIntoArray(message);
  if (limit && msg.length > limit) return false;
  if (avoid && msg.some(i => avoid.includes(i))) return false;

  return content.every(row => msg.some(i => row.includes(i)));
}

export async function sendTextMessage(
  options: SendMessageOptions,
): Promise<void> {
  const {
    messageObj,
    content,
    typingTimeout = 1000,
    answerTimeout = content.length * 100,
    reply = true,
  } = options;

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

export function shouldSendMessage(author: User): boolean {
  const now = getCurrentDate();
  if (now.getHours() < 6 || now.getHours() >= 22) return false;
  if (author.bot) return false;
  return true;
}
