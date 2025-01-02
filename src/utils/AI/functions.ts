import { FunctionDeclaration, SchemaType } from '@google/generative-ai';
import OpenAI_API from '../../services/AI/OpenAI';
import SerpAPI from '../../services/API/SerpAPI';
import { Logger } from '../misc/logger';
import { DrawImageData } from '../../types';
import { getCurrentDate } from '../content';

export const functionDeclarations: FunctionDeclaration[] = [
  {
    name: 'drawImage',
    description: 'Generate an image based on given description.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        imageDescription: {
          type: SchemaType.STRING,
          description: 'Description of the image to generate.',
        },
        options: {
          type: SchemaType.OBJECT,
          description: 'Generation options',
          properties: {
            shape: {
              type: SchemaType.STRING,
              description: 'Shape of the image. Default is "SQUARE".',
              enum: ['SQUARE', 'RECTANGLE_HORIZONTAL', 'RECTANGLE_VERTICAL'],
            },
            n: {
              type: SchemaType.INTEGER,
              description:
                'Number of images to generate. Minimum is 1, maximum is 4. Default is 1',
            },
          },
          required: [],
        },
      },
      required: ['imageDescription'],
    },
  },
  {
    name: 'searchOnInternet',
    description: 'Searches for real-time information on the Internet.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: {
          type: SchemaType.STRING,
          description: 'Query for searching',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'getCurrentDate',
    description: 'Tells current time and date.',
  },
];

export async function useFunction(functionName: string, args: any) {
  switch (functionName) {
    case 'drawImage':
      return await OpenAI_API.generateImage(
        args.imageDescription,
        args.options,
      );
    case 'searchOnInternet':
      return await SerpAPI.search(args.query);
    case 'getCurrentDate':
      return getNow();
    default:
      Logger.error(
        'event',
        'getting AI response',
        `Invalid function: ${functionName}`,
      );
      return null;
  }
}

export function isGeneratedImage(data: any): data is DrawImageData {
  return !!data.image;
}

function getNow() {
  const date = getCurrentDate();
  return {
    date,
  };
}
