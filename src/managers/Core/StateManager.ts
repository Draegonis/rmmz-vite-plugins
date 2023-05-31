class DdmStateManager<T, K> {
  #current: T;
  #last: T;
  #stateSubKeys: K;
  #subScribed: {
    [key: string]: (state: T) => void;
  } = {};

  constructor(initState: T, stateSubKeys: K) {
    this.#current = initState;
    this.#last = initState;
    this.#stateSubKeys = stateSubKeys;
  }

  get current() {
    return this.#current;
  }
  set current(newState: T) {
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
  onStateChange(state: T) {
    Object.keys(this.#stateSubKeys as K extends {} ? K : never).forEach(
      (key) => {
        if (this.#subScribed[key]) {
          this.#subScribed[key](state);
        }
      }
    );
  }
  /**
   * Method to register callbacks to a subscription keys.
   * @param {string} key - the key to access the callback.
   * @param {(state: string) => void} callback - the callback to be called with the change of state.
   */
  subscribe(key: string, callback: (state: T) => void) {
    if (
      key in (this.#stateSubKeys as K extends {} ? K : never) &&
      !this.#subScribed[key]
    ) {
      this.#subScribed[key] = callback;
    }
  }
}

export { DdmStateManager };
