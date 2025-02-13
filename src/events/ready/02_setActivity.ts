import { ActivityType, Client } from 'discord.js';
import { activity } from '../../config.json';
import { cf, Logger } from '../../utils/misc';

export default function (c: Client<true>) {
  if (!activity.type) c.user.setActivity();
  else {
    let type;
    switch (activity.type) {
      case 'playing':
        type = ActivityType.Playing;
        break;
      case 'watching':
        type = ActivityType.Watching;
        break;
      case 'listening':
        type = ActivityType.Listening;
        break;
      case 'streaming':
        type = ActivityType.Streaming;
    }
    c.user.setActivity({ name: activity.text, type });
  }
  const msg = `> ${cf.b}Activity:${cf.r} ${activity.type ? `${activity.type.toUpperCase()} ${activity.text}` : 'none'}`;
  Logger.log(msg);
}
