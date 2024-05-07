import type { CommandOptions, SlashCommandProps } from 'commandkit';
import { SlashCommandBuilder } from 'discord.js';

export const data: SlashCommandBuilder = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Responde com "pong"');

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
  deleted: false,
};
