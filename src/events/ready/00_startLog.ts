import { Client } from 'discord.js';
import { cf, Logger } from '../../utils/misc';
import Luna from '../../utils/Luna';

export default function (client: Client<true>) {
  Luna.config();
  Logger.log(
    `${cf.b + cf.u}${client.user.username}${cf.rb} is currently ${cf.b + cf.fg}online${cf.fw}!${cf.r}\n`,
  );
}
