import { SlashCommandBuilder } from 'discord.js';
import { getCommandDescription, getMessage } from '../../json';
import { CommandOptions, SlashCommandProps } from 'commandkit';
import { Logger } from '../../utils';

const ban = getCommandDescription('ban');
const modMessages = getMessage('moderation');
const userNotFoundMsg = getMessage('userNotFound');

export const data = new SlashCommandBuilder()
  .setName(ban.name)
  .setDescription(ban.description)

  // "user" option
  .addUserOption(opt =>
    opt
      .setName(ban.options![0].name)
      .setDescription(ban.options![0].description)
      .setRequired(true),
  )

  // "reason" option
  .addStringOption(opt =>
    opt
      .setName(ban.options![1].name)
      .setDescription(ban.options![1].description),
  );

export async function run({ interaction }: SlashCommandProps): Promise<void> {
  const options = interaction.options;
  const members = interaction.guild?.members;
  const requestUser = interaction?.member?.user;
  const requestMember = members!.cache.get(requestUser!.id)!;
  const me = members!.me!;

  const user = options.getUser(ban.options![0].name)!;
  const member = interaction.guild?.members.cache.get(user.id);
  const reason = options.getString(ban.options![1].name) || undefined;
  const action = {
    mold: '{action}',
    inf: 'banir',
    par: 'banido',
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

    await member.ban({ reason });
    await interaction.reply({
      content: `${user.username} foi banido.\n${reason ? `Razão: ${reason}` : 'Nenhuma razão providenciada.'}`,
    });
  } catch (err) {
    Logger.error('slash', 'banir', err);
  }
}

export const options: CommandOptions = {
  userPermissions: ['BanMembers'],
  botPermissions: ['BanMembers'],
};
