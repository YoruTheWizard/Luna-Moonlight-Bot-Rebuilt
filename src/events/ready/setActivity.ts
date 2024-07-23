import { ActivityType, Client } from 'discord.js';
import { activity } from '../../config.json';

export default function (c: Client<true>) {
  if (!activity.type) return;
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
