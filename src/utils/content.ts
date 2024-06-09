import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandStringOption,
} from 'discord.js';

import { commandDescriptions, messages, scanTitles } from '../json';
import type {
  CommandOptionChoiceFormat,
  ContentLinkObject,
  EmbedFunctionOptions,
  ScanTitle,
} from '../types';
const announcement = commandDescriptions.announcement;

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

export function getTitlesChoices(): CommandOptionChoiceFormat[] {
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
    .setName(announcement.options[0].name)
    .setDescription(announcement.options[0].description)
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
  const { embeds, rows, ephemeral } = options;
  let { role } = options;
  if (!role) role = '@everyone';
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
