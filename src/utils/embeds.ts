import {
  APIEmbed,
  ColorResolvable,
  EmbedBuilder,
  Guild,
  GuildMember,
  PartialGuildMember,
  TextChannel,
} from 'discord.js';

import { getEmoji, messages } from '../json';

type WelcomeEmbedOptions = {
  imageUrl: string;
  rulesChannel?: string | TextChannel;
  releasesChannel?: string | TextChannel;
  announcementsChannel?: string | TextChannel;
  color?: string | ColorResolvable;
};
type WelcomeEmbedFn = (
  member: GuildMember,
  guild: Guild,
  options: WelcomeEmbedOptions,
) => APIEmbed;
type GoodbyeEmbedFn = (
  member: GuildMember | PartialGuildMember,
  guild: Guild,
  options: Pick<WelcomeEmbedOptions, 'imageUrl' | 'color'>,
) => APIEmbed;

export abstract class EmbedGenerator {
  static welcome: WelcomeEmbedFn = (member, guild, options) => {
    const {
      imageUrl,
      rulesChannel,
      releasesChannel,
      announcementsChannel,
      color = null,
    } = options;

    const embed = new EmbedBuilder()
      .setColor(color as ColorResolvable)
      .setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      })
      .setTitle(`Seja bem-vindo(a) ao ${guild.name}`)
      .setDescription(
        `Olá ${member}, espero que se divirta na Moonlight Valley! ${getEmoji('stars')}`,
      )
      .setImage(imageUrl)
      .setThumbnail(guild.iconURL())
      .setFooter({ text: `Membro No. ${guild.memberCount}` });

    if (rulesChannel)
      embed.addFields({
        name: `<#${
          typeof rulesChannel === 'string' ? rulesChannel : rulesChannel.id
        }>`,
        value: messages.welcome.rules,
        inline: true,
      });
    if (releasesChannel)
      embed.addFields({
        name: `<#${
          typeof releasesChannel === 'string'
            ? releasesChannel
            : releasesChannel.id
        }>`,
        value: messages.welcome.rules,
        inline: true,
      });
    if (announcementsChannel)
      embed.addFields({
        name: `<#${
          typeof announcementsChannel === 'string'
            ? announcementsChannel
            : announcementsChannel.id
        }>`,
        value: messages.welcome.rules,
        inline: true,
      });

    return embed.toJSON();
  };

  static goodbye: GoodbyeEmbedFn = (
    member,
    guild,
    { imageUrl, color = null },
  ) => {
    const embed = new EmbedBuilder()
      .setColor(color as ColorResolvable)
      .setTitle('Tchau...')
      .setDescription(
        `${member.user.username} saiu do ${guild.name}... Espero que algum dia volte...`,
      )
      .setImage(imageUrl);

    return embed.toJSON();
  };
}
