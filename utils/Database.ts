import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * This is a Database mock class.
 *
 * This uses AsyncStorage to store and retrieve data.
 */
export default class Database {
  /**
   * This is a mock function to get data from the database.
   *
   * @param {string} key The key to get data for.
   * @returns {Promise<string>} The data for the key.
   */
  async get(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }

  /**
   * This is a mock function to set data in the database.
   *
   * @param {string} key The key to set data for.
   * @param {string} value The value to set for the key.
   * @returns {Promise<void>} A promise that resolves when the data is set.
   */
  async set(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  }
}
