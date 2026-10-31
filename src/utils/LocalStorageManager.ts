export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private storage: Storage = window.localStorage;

  private constructor() {}

  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  public save(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  public get(key: string): string | null {
    return this.storage.getItem(key);
  }
}
