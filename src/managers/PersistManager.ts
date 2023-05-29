// Store
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";
import { get, set, del } from "idb-keyval";
import { inflate, deflate } from "pako";
// Helpers
import { fetchJsonSchema } from "../data/zod/zodHelpers";
import { setGameVariables, getGameVariables } from "../helpers/gameFuncs";
// Enums
import { DdmStoredKeys, StoredKeys } from "../enums/keys";
// Data
import { persistJsonPath } from "../data/filepaths";
import { persistIndexSchema } from "../data/zod/PersistIndex";
import { v4 as uuidV4 } from "uuid";
// Types
import type { Draft } from "immer";
import type { DdmPersistIndexSchema } from "../data/zod/PersistIndex";
import type { DdmPersistState, DdmAllPersistStore } from "../types/ddmTypes";

enableMapSet(); // So immer can use map and sets in zustand store.

// ===================================================
//                    INIT-STATE

/**
 * The initial state for the persist store.
 */
const initPersist: DdmPersistState = {
  isInit: false,
  currentId: "",
  stored: {
    stash: new Map([]),
    switch: new Map([]),
    var: new Map([]),
    custom: new Map([]),
  },
};

// ===================================================
//                    HELPERS

/**
 * A function that updates specific parts of state.stored in the database.
 * @param {DdmStoredKeys} key - the key in state.stored to update.
 * @param {Draft<DdmAllPersistStore["stored"]>} stored - the WritableDraft of state.stored.
 */
const storeSingle = (
  key: DdmStoredKeys,
  stored: Draft<DdmAllPersistStore["stored"]>
) => {
  const setSwitches = () => {
    for (const id of stored.switch.keys()) {
      const newValue = getGameVariables.switch(id);
      if (newValue) stored.switch.set(id, newValue);
    }
  };
  const setVariables = () => {
    for (const id of stored.var.keys()) {
      const newValue = getGameVariables.var(id);
      if (newValue) stored.var.set(id, newValue);
    }
  };

  switch (key) {
    case "custom":
      for (const id of stored.custom.keys()) {
        stored.custom.set(id, DdmApi.PM.custom[id]);
      }
      break;
    case "stash":
      for (const [key, value] of DdmApi.PM.stash) {
        if (value === 0) {
          stored.stash.delete(key);
          DdmApi.PM.stash.delete(key);
        } else {
          stored.stash.set(key, value);
        }
      }
      break;
    case "switch":
      setSwitches();
      break;
    case "var":
      setVariables();
      break;
    case "switch&var":
      setSwitches();
      setVariables();
      break;
  }
};

/**
 * A function that sets a new uuid string to the store,
 * in the rare case the new id is the same it will generate a new one.
 * @param {Draft<DdmAllPersistStore>} state - the WritableDraft to compare the uuid string.
 * @returns {string} returns the new uuid string.
 */
const setNewId = (state: Draft<DdmAllPersistStore>): string => {
  let newId = "";

  do {
    newId = uuidV4();
  } while (newId === state.currentId);

  state.currentId = newId;

  return newId;
};

// ===================================================
//                     STORE

/**
 * The Zustand store that manages the persist state. It uses indexeddb so the data
 * can be retrieved for all save games.
 */
const persistStore = create<DdmAllPersistStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initPersist,
        /**
         * A function to initialize the store variables with the data in DdmPersist.json.
         */
        async initStore(refresh) {
          const isInit = get().isInit;
          let exitInit = false;

          if (isInit) exitInit = true;
          if (refresh) exitInit = false;
          if (exitInit) return;

          const StoreIndex = await fetchJsonSchema<DdmPersistIndexSchema>(
            persistJsonPath,
            persistIndexSchema
          );

          if (!StoreIndex) return;

          set((state) => {
            Object.entries(initPersist).forEach(([key, value]) => {
              state[key] = value;
            });

            state.currentId = uuidV4();

            StoreIndex.stash.forEach(([key, qnty]) => {
              state.stored.stash.set(key, qnty);
            });

            StoreIndex.custom.forEach((key) => {
              state.stored.custom.set(key, null);
              DdmApi.PM.custom[key] = null;
            });

            StoreIndex.switch.forEach((key) => {
              state.stored.switch.set(key, null);
            });

            StoreIndex.var.forEach((key) => {
              state.stored.var.set(key, null);
            });

            state.isInit = true;
          });
        },
        /**
         * Fetches the data in the store if needed. If the uuid Id is the same it shouldn't
         * need to fetch since the data should be the same as the data in the store.
         * @param {string} storeId - the uuid stored in the save file to be compared with
         * the uuid in the store.
         */
        fetchEntireStore(storeId: string) {
          const { currentId, stored } = get();

          if (currentId !== storeId) {
            stored.switch.forEach((value, key) => {
              if (value !== null) setGameVariables.switch(key, value);
            });

            stored.var.forEach((value, key) => {
              setGameVariables.var(key, value);
            });
          }

          return { custom: stored.custom, stash: stored.stash };
        },
        /**
         * Loads the custom object into DdmApi.PM.custom so it should be able to be used in the title screen.
         * @returns {Map<string, any>} - the map object loaded from storage containing the object key and value.
         */
        fetchCustomOnly(): Map<string, any> {
          const custom = get().stored.custom;
          return custom;
        },
        /**
         * Updates the data in the localStorage.
         * @returns {string} Returns a uuid string to be saved into the Rmmz save file.
         */
        updateStore(): string {
          let newId = "";

          set((state) => {
            const stored = state.stored;
            newId = setNewId(state);

            storeSingle("switch&var", stored);
            storeSingle("custom", stored);
            storeSingle("stash", stored);
          });

          return newId;
        },
        updateSingle(keyToUpdate) {
          if (DdmApi.Core.Data.stringIsInEnum(keyToUpdate, StoredKeys)) {
            set((state) => {
              const stored = state.stored;
              setNewId(state);
              storeSingle(keyToUpdate, stored);
            });
          }
        },
      })),
      {
        name: `Ddm-Draegonis-Persist-Store`,
        /**
         * To set/get/remove from indexeddb and able to handle the
         * stored object maps.
         */
        storage: {
          getItem: async (name) => {
            const str = await get(name);
            const restored = inflate(str, { to: "string" });
            const storeState = JSON.parse(restored) as DdmPersistState;
            return {
              state: {
                ...storeState,
                stored: {
                  stash: new Map(storeState.stored.stash),
                  switch: new Map(storeState.stored.switch),
                  var: new Map(storeState.stored.var),
                  custom: new Map(storeState.stored.custom),
                },
              },
            };
          },
          setItem: async (name, newValue) => {
            const str = JSON.stringify({
              state: {
                ...newValue.state,
                stored: {
                  stash: Array.from(newValue.state.stored.stash.entries()),
                  switch: Array.from(newValue.state.stored.switch.entries()),
                  var: Array.from(newValue.state.stored.var.entries()),
                  custom: Array.from(newValue.state.stored.custom.entries()),
                },
              },
            });
            const compressed = deflate(str);
            await set(name, compressed);
          },
          removeItem: async (name) => await del(name),
        },
      }
    ),
    {
      name: `Ddm-Draegonis-Persist-Debug`,
      serialize: {
        options: {
          map: true,
        },
      },
    }
  )
);

// ===================================================
//                      MANAGER

/**
 * The static manager class to expose the functions onto the api.
 */
class PersistManager {
  #initStore = persistStore.getState().initStore;
  #fetchStore = persistStore.getState().fetchEntireStore;
  #fetchCustom = persistStore.getState().fetchCustomOnly;
  #updateStore = persistStore.getState().updateStore;
  #updateSingle = persistStore.getState().updateSingle;

  custom: Record<string, any> = {};

  #setCustom(data: Map<string, any>) {
    for (const [key, value] of data) {
      this.custom = {
        [key]: value,
      };
    }
  }

  stash: Map<number, number> = new Map([]);

  #setStash(data: Map<number, number>) {
    for (const entry of data) {
      this.stash.set(...entry);
    }
  }

  async onStart(refresh: boolean) {
    await this.#initStore(refresh);
    const custom = this.#fetchCustom();
    this.#setCustom(custom);
  }

  onLoad(storeId: string) {
    const { custom, stash } = this.#fetchStore(storeId);
    this.#setCustom(custom);
    this.#setStash(stash);
  }

  onSave() {
    return this.#updateStore();
  }

  saveSingle(updateKey: DdmStoredKeys) {
    if (DdmApi.Core.Data.stringIsInEnum(updateKey, StoredKeys)) {
      this.#updateSingle(updateKey);
    }
  }
}

const DdmPersistManager = new PersistManager();
type DdmPersistManagerType = PersistManager;

// ===================================================
//                    EXPORT

export { DdmPersistManager };
export type { DdmPersistManagerType };
