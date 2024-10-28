import {
  ChatInputCommandInteraction,
  ColorResolvable,
  EmbedBuilder,
} from 'discord.js';
import { getCommandDescription, messages } from '../json';
import {
  getScanTitle,
  linkListTreater,
  linksButtonRow,
  sendContentEmbeds,
} from './content';
import { ErrorLogger } from './errorLogger';

const announcement = getCommandDescription('announcement');
const announcement_release = getCommandDescription('announcement_release');
const announcement_title = getCommandDescription('announcement_title');
//const announcement_recruitment = getCommandDescription('announcement_recruitment');

type AnnouncementFunc = (
  interaction: ChatInputCommandInteraction,
) => Promise<void>;

export abstract class Announcement {
  static release: AnnouncementFunc = async interaction => {
    const options = interaction.options;
    const announcementOpts = announcement.options!;
    const releaseOpts = announcement_release.options!;

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

    const titleObj = getScanTitle(titleName);
    if (!titleObj) return;

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

    const releaseEmbed = new EmbedBuilder()
      .setColor(titleObj.color as ColorResolvable)
      .setAuthor({
        name: (titleObj.fullNameJP || titleObj.fullNameEN) as string,
      })
      .setTitle(`Novo ${type} de ${titleObj.name}`)
      .setDescription(
        `O${plural} ${type}${plural} ${numStr}${volume ? ` do volume *${volume}*` : ''} já est${plural ? 'ão' : 'á'} disponíve${plural ? 'is' : 'l'}! Venha ver! ${titleObj.emoji || ':tada:'}`,
      );

    if (titleDesc)
      releaseEmbed.addFields({ name: 'Descrição', value: titleDesc });

    if (image)
      releaseEmbed.setImage(typeof image === 'string' ? image : image.url);

    const role = interaction.guild?.roles.cache.get(titleObj.fanRole);

    try {
      await sendContentEmbeds(interaction, {
        role: role || '@deleted-role',
        embeds: [releaseEmbed.toJSON()],
        ephemeral: true,
        rows: [linksRow],
      });
    } catch (err) {
      ErrorLogger.slash(announcement_release.name, err);
      interaction.reply({ content: messages.error, ephemeral: true });
    }
  };

  static title: AnnouncementFunc = async interaction => {
    const options = interaction.options;
    const titleOpts = announcement_title.options!;

    const author = interaction.user;
    const titleName = options.getString(titleOpts[0].name, true);
    const titleLinksText = options.getString(titleOpts[1].name, true);
    const titleLinks = linkListTreater(titleLinksText);
    const linksRow = linksButtonRow(titleLinks);
    const sinopsys = options.getString(titleOpts[2].name);
    const comment = options.getString(titleOpts[3].name);
    const image =
      options.getAttachment(titleOpts[4].name) ||
      options.getString(titleOpts[5].name);

    const titleEmbed = new EmbedBuilder()
      .setColor('Random')
      .setAuthor({
        name: author.displayName,
        iconURL: author.displayAvatarURL(),
      })
      .setTitle('Nova obra chegando na Moonlight!')
      .setDescription(`Nome: **${titleName}**`);

    if (sinopsys) titleEmbed.addFields({ name: 'Sinopse', value: sinopsys });
    if (comment) titleEmbed.addFields({ name: 'Comentário', value: comment });
    if (image)
      titleEmbed.setImage(typeof image === 'string' ? image : image.url);

    try {
      await sendContentEmbeds(interaction, {
        embeds: [titleEmbed.toJSON()],
        ephemeral: true,
        rows: [linksRow],
      });
    } catch (err) {
      ErrorLogger.slash('obra', err);
    }
  };

  // static recruitment: AnnouncementFunc = async interaction=> { }
}
