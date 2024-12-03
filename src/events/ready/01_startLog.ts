import { Client } from 'discord.js';
import { consoleFormat as cf, Logger } from '../../utils';

export default function (client: Client<true>) {
  Logger.log(
    `${cf.b + cf.u}${client.user.username}${cf.rb} is currently ${cf.b + cf.fg}online${cf.fw}!${cf.r}\n`,
  );
}
