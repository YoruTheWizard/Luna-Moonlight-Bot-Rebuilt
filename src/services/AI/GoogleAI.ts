import {
  ChatSession,
  Content,
  GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { AIConfig } from '../../config.json';
import getInstructions from '../../utils/AI/getInstructions';
import { functionDeclarations } from '../../utils/AI/functions';
const geminiConfig = AIConfig.gemini;

export default abstract class GoogleAI {
  private static AI_INSTANCE: GenerativeModel | null = null;
  private static CHAT: ChatSession | null = null;
  private static COOLDOWN: boolean = false;

  /**
   * `[ AI: Google ]`
   *
   * Initiates new Google Generative AI model instance with the configurations provided in `config.json` and returns the model instance.
   * @param history Chat history (optional)
   */
  public static async init(history: Content[] = []) {
    // Init Google API
    const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);

    // Get model instance
    GoogleAI.AI_INSTANCE = genAI.getGenerativeModel({
      model: geminiConfig.model,
    });

    // Start chat
    GoogleAI.CHAT = GoogleAI.AI_INSTANCE.startChat({
      history,
      systemInstruction: {
        role: 'user',
        parts: getInstructions(),
      },
      tools: [
        {
          functionDeclarations,
        },
      ],
      generationConfig: geminiConfig.options,
    });

    // Return instance
    return GoogleAI.AI_INSTANCE;
  }

  public static async getInstance() {
    if (GoogleAI.AI_INSTANCE) return GoogleAI.AI_INSTANCE;
    return await GoogleAI.init();
  }

  public static async getChat(history: Content[] = []) {
    const chatHistory = await GoogleAI.getChatHistory();
    if (history.length && (!chatHistory || !chatHistory.length))
      await GoogleAI.init(history);
    return GoogleAI.CHAT;
  }

  public static async getChatHistory() {
    if (!GoogleAI.CHAT) return null;
    return await GoogleAI.CHAT.getHistory();
  }

  public static get isCooldown() {
    return GoogleAI.COOLDOWN;
  }

  public static set isCooldown(v: boolean) {
    GoogleAI.COOLDOWN = v;
  }
}
