import { Client } from 'discord.js';
import { consoleFormat as cf } from '../../utils';

export default function (c: Client<true>) {
  console.log(
    `${cf.b + cf.u}${c.user.username}${cf.r + cf.u} is currently ${cf.b + cf.fg}online${cf.r + cf.u}!${cf.r}\n`,
  );
}
