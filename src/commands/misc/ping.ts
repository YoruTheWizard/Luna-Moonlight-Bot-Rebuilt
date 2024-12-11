import type { CommandOptions, SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder } from 'discord.js';
import { getCommandDescription } from '../../json';

const ping = getCommandDescription('ping');

export const data: SlashCommandBuilder = new SlashCommandBuilder()
  .setName(ping.name)
  .setDescription(ping.description);

export async function run({
  interaction,
  client,
}: SlashCommandProps): Promise<void> {
  await interaction.deferReply();
  const reply = await interaction.fetchReply();
  const ping = reply.createdTimestamp - interaction.createdTimestamp;
  interaction.editReply(
    `:ping_pong: Pong! Cliente: ${ping}ms | Websocket: ${client.ws.ping}ms`,
  );
}

export const options: CommandOptions = {
  awakeOnly: true,
};
