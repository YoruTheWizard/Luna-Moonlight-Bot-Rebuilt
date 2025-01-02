import {
  ActionRowBuilder,
  APIActionRowComponent,
  APIButtonComponent,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandStringOption,
  TextChannel,
} from 'discord.js';

import { getCommandDescription, messages, scanTitles } from '../json';
import type {
  ContentLinkObject,
  EmbedFunctionOptions,
  ScanTitle,
} from '../../types';

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
export function linksButtonRow(
  links: ContentLinkObject[],
): APIActionRowComponent<APIButtonComponent> {
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
    const channel = interaction.channel as TextChannel;
    await channel.send(messageOptions);
    interaction.reply({ content: messages.messageSent, ephemeral });
  } else interaction.reply(messageOptions);
}
