import { Part } from '@google/generative-ai';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export default function getInstructions() {
  const filePath = resolve(
    __dirname,
    '..',
    '..',
    'assets',
    'docs',
    'AIInstructions.txt',
  );
  const data = readFileSync(filePath, { encoding: 'utf-8' });
  const dataArray = data.split('\n\n').map(text => {
    return { text } as Part;
  });
  return dataArray;
}
