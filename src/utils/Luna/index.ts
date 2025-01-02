import { status, AIConfig } from '../../config.json';

export default abstract class Luna {
  private static ASLEEP = false;
  private static AI_ON = true;

  private constructor() {}

  public static config() {
    Luna.ASLEEP = status !== 'invisible';
    Luna.AI_ON = AIConfig.isOn;
  }

  public static get isAsleep() {
    return Luna.ASLEEP;
  }

  public static set isAsleep(value: boolean) {
    Luna.ASLEEP = value;
  }
  public static get isAIOn() {
    return Luna.AI_ON;
  }

  public static set isAIOn(value: boolean) {
    Luna.AI_ON = value;
  }
}

export * from './restart';
export * from './status';
