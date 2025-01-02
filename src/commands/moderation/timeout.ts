import { SlashCommandBuilder } from 'discord.js';
import { CommandOptions, SlashCommandProps } from 'commandkit';
import ms from 'ms';

import { getCommandDescription, getMessage } from '../../utils/json';
import { Logger, msToTime } from '../../utils/misc';

const timeout = getCommandDescription('timeout');
const modMessages = getMessage('moderation');
const userNotFoundMsg = getMessage('userNotFound');

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
      await interaction.editReply(userNotFoundMsg);
      return;
    }
    if (member.id === interaction.guild?.ownerId) {
      await interaction.editReply(
        modMessages.isOwner.replace(action.mold, action.par),
      );
      return;
    }
    if (user.bot) {
      await interaction.editReply(
        modMessages.isBot.replace(action.mold, action.inf),
      );
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply(modMessages.timeoutNaN);
      return;
    }
    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply(modMessages.timeoutInvalid);
      return;
    }

    const targetUserRole = member.roles.highest;
    const requestUserRole = requestMember?.roles.highest;
    const botRole = me?.roles.highest;
    if (requestUserRole.comparePositionTo(targetUserRole) < 1) {
      await interaction.editReply(
        modMessages.requestPositionLower.replace(action.mold, action.inf),
      );
      return;
    }
    if (botRole.comparePositionTo(targetUserRole) < 1) {
      await interaction.editReply(
        modMessages.botPositionLower.replace(action.mold, action.inf),
      );
      return;
    }

    const isMuted = member.isCommunicationDisabled();
    await member.timeout(msDuration, reason);
    const prettyDuration = msToTime(msDuration);
    if (isMuted) {
      await interaction.editReply(
        `O castigo de ${member.nickname || member.user.displayName} foi alterado para ${prettyDuration}`,
      );
    } else {
      await interaction.editReply(
        `${member.nickname || member.user.displayName} foi silenciado por ${prettyDuration}.\n${reason ? `Razão: ${reason}` : 'Nenhuma razão providenciada.'}`,
      );
    }
  } catch (err) {
    Logger.error('slash', 'castigo', err);
  }
}

export const options: CommandOptions = {
  userPermissions: ['MuteMembers'],
  botPermissions: ['MuteMembers'],
};
