
export class AppStorage {
  private cache: Record<string, string> = {};
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  /**
   * Gets a JSON value from storage and deserializes it.
   * Returns `defaultValue` if it doesn't exist.
   *
   * Storage errors are logged, but will not throw.
   */
  public get<T>(key: string, defaultValue: T): T {
    let serializedValue: string | null = null;

    try {
      serializedValue = this.storage.getItem(key);
    } catch (err) {
      // If we have a cached value, use it.
      serializedValue = this.cache[key] || null;
    }

    // If there's no result, or we get the literal string `undefined`, return the default value.
    if (serializedValue === null || serializedValue === 'undefined') {
      return defaultValue;
    }

    try {
      return JSON.parse(serializedValue) as T;
    } catch (err) {
      this.remove(key);
      return defaultValue;
    }
  }

  /**
   * Gets a JSON value from storage and deserializes it.
   * Returns `null` if it doesn't exist.
   *
   * Storage errors are logged, but will not throw.
   */
  public getOptional<T>(key: string): T | null {
    return this.get(key, null);
  }

  /**
   * JSON Serializes a value and saves it.
   * Throws if the value can't be serialized.
   *
   * Storage errors are logged, but will not throw.
   */
  public set(key: string, value: {}) {
    let serializedValue: string;

    try {
      serializedValue = JSON.stringify(value);
    } catch (err) {
      // Log a warning and rethrow. It is a developer error to pass a value that can't be serialized, so we don't want to gracefully fail to serialize.
      throw err;
    }

    // Cache the value. This allows for identical behavior when storage fails.
    this.cache[key] = serializedValue;

    try {
      this.storage.setItem(key, serializedValue);
    } catch (err) {
    }
  }

  /**
   * Removes a value from storage.
   *
   * Storage errors are logged, but will not throw.
   */
  public remove(key: string) {
    delete this.cache[key];

    try {
      this.storage.removeItem(key);
    } catch (err) {
    }
  }

  /**
   * Clears all data from storage.
   *
   * Storage errors are logged, but will not throw.
   */
  public clear() {
    this.cache = {};

    try {
      this.storage.clear();
    } catch (err) {
    }
  }
}
