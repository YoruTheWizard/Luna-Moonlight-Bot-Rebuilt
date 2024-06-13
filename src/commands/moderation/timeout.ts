import { SlashCommandBuilder } from 'discord.js';
import { CommandOptions, SlashCommandProps } from 'commandkit';
import ms from 'ms';
import { default as prettyMs } from 'pretty-ms';

import { getCommandDescription, messages } from '../../json';
import { ErrorLogger } from '../../utils';

const timeout = getCommandDescription('timeout');

export const data = new SlashCommandBuilder()
  .setName(timeout.name)
  .setDescription(timeout.description)

  // "user" option
  .addUserOption(opt =>
    opt
      .setName(timeout.options![0].name)
      .setDescription(timeout.options![0].description)
      .setRequired(true),
  )

  // "duration" option
  .addStringOption(opt =>
    opt
      .setName(timeout.options![1].name)
      .setDescription(timeout.options![1].description)
      .setRequired(true),
  )

  // "reason" option
  .addStringOption(opt =>
    opt
      .setName(timeout.options![2].name)
      .setDescription(timeout.options![2].description),
  );

export async function run({ interaction }: SlashCommandProps): Promise<void> {
  const options = interaction.options;
  const members = interaction.guild?.members;
  const requestUser = interaction?.member?.user;
  const requestMember = members!.cache.get(requestUser!.id)!;
  const me = members!.me!;

  const user = options.getUser(timeout.options![0].name)!;
  const member = interaction.guild?.members.cache.get(user.id);
  const duration = options
    .getString(timeout.options![1].name)!
    .replace('dia', 'day');
  const reason = options.getString(timeout.options![2].name) || undefined;
  const action = {
    mold: '{action}',
    inf: 'silenciar',
    par: 'silenciado',
  };

  try {
    await interaction.deferReply({ ephemeral: true });

    if (!member) {
      await interaction.editReply(messages.moderation.userNotFound);
      return;
    }
    if (member.id === interaction.guild?.ownerId) {
      await interaction.editReply(
        messages.moderation.isOwner.replace(action.mold, action.par),
      );
      return;
    }
    if (user.bot) {
      await interaction.editReply(
        messages.moderation.isBot.replace(action.mold, action.inf),
      );
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply(messages.moderation.timeoutNaN);
      return;
    }
    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply(messages.moderation.timeoutInvalid);
      return;
    }

    const targetUserRole = member.roles.highest;
    const requestUserRole = requestMember?.roles.highest;
    const botRole = me?.roles.highest;
    if (requestUserRole.comparePositionTo(targetUserRole) < 1) {
      await interaction.editReply(
        messages.moderation.requestPositionLower.replace(
          action.mold,
          action.inf,
        ),
      );
      return;
    }
    if (botRole.comparePositionTo(targetUserRole) < 1) {
      await interaction.editReply(
        messages.moderation.botPositionLower.replace(action.mold, action.inf),
      );
      return;
    }

    await member.timeout(msDuration, reason);
    const prettyDuration = prettyMs(msDuration, { verbose: true })
      .replace('second', 'segundo')
      .replace('minute', 'minuto')
      .replace('hour', 'horas')
      .replace('day', 'dia');
    if (member.isCommunicationDisabled()) {
      await interaction.reply(
        `O castigo de ${member.nickname} foi alterado para ${prettyDuration}`,
      );
    } else {
      await interaction.reply(
        `${member.nickname} foi silenciado por ${prettyDuration}.\n${reason ? `Razão: ${reason}` : 'Nenhuma razão providenciada.'}`,
      );
    }
  } catch (err) {
    ErrorLogger.slash('castigo', err);
  }
}

export const options: CommandOptions = {
  userPermissions: ['MuteMembers'],
  botPermissions: ['MuteMembers'],
};
