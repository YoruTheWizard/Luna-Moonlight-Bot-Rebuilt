import { SlashCommandBuilder } from 'discord.js';
import { getCommandDescription, messages } from '../../json';
import { CommandOptions, SlashCommandProps } from 'commandkit';
import { ErrorLogger } from '../../utils';

const kick = getCommandDescription('kick');

export const data = new SlashCommandBuilder()
  .setName(kick.name)
  .setDescription(kick.description)

  // "user" option
  .addUserOption(opt =>
    opt
      .setName(kick.options![0].name)
      .setDescription(kick.options![0].description)
      .setRequired(true),
  )

  // "reason" option
  .addStringOption(opt =>
    opt
      .setName(kick.options![1].name)
      .setDescription(kick.options![1].description),
  );

export async function run({ interaction }: SlashCommandProps): Promise<void> {
  const options = interaction.options;
  const members = interaction.guild?.members;
  const requestUser = interaction?.member?.user;
  const requestMember = members!.cache.get(requestUser!.id)!;
  const me = members!.me!;

  const user = options.getUser(kick.options![0].name)!;
  const member = interaction.guild?.members.cache.get(user.id);
  const reason = options.getString(kick.options![1].name) || undefined;
  const action = {
    mold: '{action}',
    inf: 'chutar',
    par: 'chutado',
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

    await member.kick(reason);
    await interaction.reply({
      content: `${user.username} foi chutado.\n${reason ? `Razão: ${reason}` : 'Nenhuma razão providenciada.'}`,
    });
  } catch (err) {
    ErrorLogger.slash('chutar', err);
  }
}

export const options: CommandOptions = {
  userPermissions: ['KickMembers'],
  botPermissions: ['KickMembers'],
};
