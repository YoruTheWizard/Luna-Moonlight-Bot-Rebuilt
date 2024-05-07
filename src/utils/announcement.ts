import {
  ChatInputCommandInteraction,
  ColorResolvable,
  CommandInteractionOptionResolver,
  EmbedBuilder,
} from 'discord.js';
import { commandDescriptions, messages } from '../json';
import {
  getScanTitle,
  linkListTreater,
  linksButtonRow,
  sendContentEmbeds,
} from './content';
import errorLogger from './errorLogger';
const { announcement, announcement_release } = commandDescriptions;

type AnnouncementFunc = (
  interaction: ChatInputCommandInteraction,
) => Promise<void>;

export const release: AnnouncementFunc = async interaction => {
  const options = interaction.options as CommandInteractionOptionResolver;
  const announcementOpts = announcement.options;
  const releaseOpts = announcement_release.options;

  const titleName = options.getString(announcementOpts[0].name)!;
  const type = options.getString(releaseOpts[0].name)!;
  const numbersText = options.getString(releaseOpts[1].name)!;
  const numbers = numbersText.split(', ');
  const titleLinksText = options.getString(releaseOpts[2].name)!;
  const titleLinks = linkListTreater(titleLinksText);
  const linksRow = linksButtonRow(titleLinks);
  const volume = options.getNumber(releaseOpts[3].name);
  const titleDesc = options.getString(releaseOpts[4].name);
  const image =
    options.getAttachment(releaseOpts[5].name) ||
    options.getString(releaseOpts[6].name);

  if (!titleLinks[0].name) {
    interaction.reply({ content: messages.wrongLinkFormat, ephemeral: true });
    return;
  }

  const plural = numbers.length > 1 ? 's' : '';
  let numStr = '';
  if (plural)
    numbers.forEach((v, i) => {
      switch (i) {
        case numbers.length - 1:
          numStr = numStr + `**${v}**`;
          break;
        case numbers.length - 2:
          numStr = numStr + `**${v}** e `;
          break;
        default:
          numStr = numStr + `**${v}**, `;
      }
    });
  else numStr = `**${numbers[0]}**`;

  const titleObj = getScanTitle(titleName);
  if (!titleObj) return;

  const releaseEmbed = new EmbedBuilder()
    .setColor(titleObj.color as ColorResolvable)
    .setAuthor({ name: (titleObj.longNameJP || titleObj.longNameEN) as string })
    .setTitle(`Novo ${type} de ${titleObj.name}`)
    .setDescription(
      `O${plural} ${type}${plural} ${numStr}${volume ? ` do volume *${volume}*` : ''} já est${plural ? 'ão' : 'á'} disponíve${plural ? 'is' : 'l'}! Venha ver!<${titleObj.emoji || ':tada:'}>`,
    );

  if (titleDesc)
    releaseEmbed.addFields({ name: 'Descrição', value: titleDesc });

  if (image)
    releaseEmbed.setImage(typeof image === 'string' ? image : image.url);

  const role = interaction.guild?.roles.cache.get(titleObj.fanRole);

  try {
    await sendContentEmbeds(interaction, {
      role: role || '@deleted-role',
      embeds: [releaseEmbed],
      ephemeral: true,
      rows: [linksRow],
    });
  } catch (err) {
    errorLogger(announcement_release.name, err);
    interaction.reply({ content: messages.error, ephemeral: true });
  }
};

// export const title: AnnouncementFunc = async interaction => { }

// export const recruitment: AnnouncementFunc = async interaction=> { }
