import { ValidationProps } from 'commandkit';
import {
  ChatInputCommandInteraction,
  GuildMemberRoleManager,
} from 'discord.js';
import { staff, testServer } from '../config.json';

export default function ({
  interaction,
  commandObj,
}: ValidationProps): boolean | void {
  interaction = interaction as ChatInputCommandInteraction;
  if (interaction.guildId === testServer) return false;
  if (commandObj.options?.staffOnly) {
    const roles = interaction.member?.roles as GuildMemberRoleManager;
    if (!roles.cache.get(staff)) {
      interaction.reply({
        content: 'Este comando só pode ser usado por membros da staff!',
        ephemeral: true,
      });
      return true;
    }
  }
}
