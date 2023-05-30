import { stringIsInEnum } from "../../helpers/common";

class DdmStateManager<T> {
  #current: T extends string ? string : never;
  #last: T extends string ? string : never;
  #stateSubKeys: readonly string[];
  #subScribed: {
    [key: string]: (state: T extends string ? string : never) => void;
  } = {};

  constructor(
    initState: T extends string ? string : never,
    stateSubKeys: readonly string[]
  ) {
    this.#current = initState;
    this.#last = initState;
    this.#stateSubKeys = stateSubKeys;
  }

  get current() {
    return this.#current;
  }
  set current(newState: T extends string ? string : never) {
    this.#current = newState;
    if (this.#last !== newState) {
      this.#last = newState;
      this.onStateChange(newState);
    }
  }
  /**
   * Method to use callbacks based on state change.
   * @param {string} state - the current state on change.
   */
  onStateChange(state: T extends string ? string : never) {
    this.#stateSubKeys.forEach((key) => {
      if (this.#subScribed[key]) {
        this.#subScribed[key](state);
      }
    });
  }
  /**
   * Method to register callbacks to a subscription keys.
   * @param {string} key - the key to access the callback.
   * @param {(state: string) => void} callback - the callback to be called with the change of state.
   */
  subscribe(
    key: string,
    callback: (state: T extends string ? string : never) => void
  ) {
    if (stringIsInEnum(key, this.#stateSubKeys) && !this.#subScribed[key]) {
      this.#subScribed[key] = callback;
    }
  }
}

export { DdmStateManager };
