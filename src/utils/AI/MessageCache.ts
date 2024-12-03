import { Part } from '@google/generative-ai';

export default abstract class MessageCache {
  private static CACHE: Part[] = [];
  public static get messages(): Part[] {
    if (!MessageCache.CACHE.length) return [];
    return MessageCache.CACHE.splice(0, MessageCache.CACHE.length);
  }
  public static push(...messages: Part[]): void {
    MessageCache.CACHE.push(...messages);
  }
}
