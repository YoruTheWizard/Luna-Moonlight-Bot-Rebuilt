import OpenAI from 'openai';
import { DrawImageFn, DrawImageOptions } from '../types';
import { AIConfig } from '../config.json';
import { ImageGenerateParams } from 'openai/resources';
import { DrawImageSize } from '../types/enum';
const OpenAIConfig = AIConfig.openai as Omit<
  ImageGenerateParams,
  'prompt' | 'user'
>;

export default abstract class OpenAI_API {
  private static INSTANCE: OpenAI | null = null;

  /**
   * `[ AI: OpenAI ]`
   *
   * Initiates a new OpenAI instance and returns it.
   */
  public static init() {
    OpenAI_API.INSTANCE = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    return OpenAI_API.INSTANCE;
  }

  public static get instance() {
    if (!OpenAI_API.INSTANCE) return OpenAI_API.init();
    return OpenAI_API.INSTANCE;
  }

  /**
   * `[ AI: OpenAI ]`
   *
   * Generates an image based on given description using an OpenAI image generation model.
   *
   * @param imageDescription Description of the image to generate
   * @param options Generation options
   * @returns The data of the generated image
   */
  public static generateImage: DrawImageFn = async (
    imageDescription,
    options,
  ) => {
    const { shape, ...optionsObj } = { ...options };
    const castOptions: DrawImageOptions = {
      ...optionsObj,
    };
    if (shape) {
      switch (shape) {
        case DrawImageSize.SQUARE:
          castOptions.size = '1024x1024';
          break;
        case DrawImageSize.RECTANGLE_HORIZONTAL:
          castOptions.size = '1792x1024';
          break;
        case DrawImageSize.RECTANGLE_VERTICAL:
          castOptions.size = '1024x1792';
      }
    }

    const result = await OpenAI_API.instance.images.generate({
      prompt: imageDescription,
      ...OpenAIConfig,
      ...castOptions,
    });
    const url = result.data[0].url;
    if (!url) return null;

    return {
      imageDescription,
      image: { url },
    };
  };
}
