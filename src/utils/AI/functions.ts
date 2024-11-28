import { FunctionDeclaration, SchemaType } from '@google/generative-ai';
import OpenAI_API from '../../services/OpenAI';
import SerpAPI from '../../services/SerpAPI';
import { Logger } from '../logger';

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
    default:
      Logger.error(
        'event',
        'getting AI response',
        `Invalid function: ${functionName}`,
      );
      return null;
  }
}
