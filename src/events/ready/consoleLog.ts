import { Client } from 'discord.js';

export default function (c: Client<true>) {
  console.log(`${c.user.username} is currently online.`);
}
