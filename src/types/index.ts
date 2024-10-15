import { CommandKit } from 'commandkit';
import {
  APIActionRowComponent,
  APIButtonComponent,
  APIEmbed,
  Client,
  Message,
  Role,
} from 'discord.js';

export type ScanTitle = {
  id: string;
  name: string;
  fullNameJP?: string;
  fullNameEN?: string;
  fullNamePT?: string;
  color: string;
  emoji: string;
  fanRole: string;
} & ({ fullNameJP: string } | { fullNameEN: string } | { fullNamePT: string });

export type EmbedFunctionOptions = {
  role?: Role | '@deleted-role' | '@everyone';
  embeds: APIEmbed[];
  rows?: APIActionRowComponent<APIButtonComponent>[];
  ephemeral: boolean;
};

export type ContentLinkObject = {
  num: number;
  name: string;
  url: string;
  emoji?: string;
};

export type CustomNicknameUser = {
  id: string | string[];
  nickname: string;
  polite?: boolean;
};

export type ScanBlooper = {
  message: string;
  author: string;
  alias: string;
  date: string | null;
};

export type ScanBloopersJsonType = {
  authors: string[];
  bloopers: ScanBlooper[];
};

export type Emoji = {
  id: string;
  triggers?: string[][];
  avoid?: string[];
  limit?: number;
  uncheckable?: boolean;
};

export type Adjective = {
  adj: string;
  bad?: boolean;
};

export type CommandDataDescription = {
  name: string;
  subName?: string;
  description: string;
  category: string;
  restriction?: 'owner' | 'dev' | 'admin' | 'staff';
  subcommands?: string[];
  options?: {
    name: string;
    description: string;
    type: string;
    choices?: {
      name: string;
      value: string;
    }[];
    required: boolean;
  }[];
};

export type CommandDescriptionsJsonType = {
  [key: string]: CommandDataDescription;
};

export type addToJsonFN = {
  (file: 'scanTitles', data: ScanTitle): void | never;
  (file: 'customNicks', data: CustomNicknameUser): void | never;
};

export type MessageCreateEventFn = (
  message: Message<true>,
  client: Client<true>,
  handler: CommandKit,
) => void;

export type SendMessageOptions = {
  messageObj: Message<true>;
  content: any;
  typingTimeout?: number;
  answerTimeout?: number;
  reply?: boolean;
};

export type CheckMessageContentOptions = {
  message: string;
  content: string[][];
  avoid?: string[];
  limit?: number;
};

export type EventMessage = {
  name: string;
  servers: {
    id: string;
    channel: string;
  }[];
  message: string;
  cronString: string;
  typingCooldown?: number;
  sendCooldown?: number;
};
