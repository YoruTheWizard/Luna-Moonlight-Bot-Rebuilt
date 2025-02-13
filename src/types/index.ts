import { CommandKit } from 'commandkit';
import {
  APIActionRowComponent,
  APIButtonComponent,
  APIEmbed,
  Client,
  Message,
  Role,
} from 'discord.js';
import { ImageGenerateParams } from 'openai/resources';
import { BaseResponse } from 'serpapi';
import { DrawImageSize } from './enum';

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
  nicknamePt?: string;
  relation?: string;
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
  typingTimeout?: number;
  answerTimeout?: number;
  reply?: boolean;
};

export type CheckMessageContentOptions = {
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

export type DrawImageData = {
  imageDescription: string;
  image: {
    url: string;
  };
} | null;

export type DrawImageOptions = Omit<ImageGenerateParams, 'prompt' | 'user'>;

export type DrawImageFn = (
  imageDescription: string,
  options?: Omit<DrawImageOptions, 'size'> & {
    shape?: DrawImageSize;
  },
) => Promise<DrawImageData>;

export type SearchOptions = {
  location: string;
  hl: string;
  gl: string;
};

export type SearchResult = {
  query: string;
  searchResults: BaseResponse;
};

export type SearchFn = (
  q: string,
  options?: SearchOptions,
) => Promise<SearchResult | null>;
