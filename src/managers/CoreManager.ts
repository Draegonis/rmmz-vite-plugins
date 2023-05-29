// Managers
import { DdmDataManager } from "./Core/DataManager";
// State
import { isWinFocus } from "../game";
// Enums
import { GameState } from "../enums/state";
// Types
import type { DdmGameState } from "../enums/state";
import type { DdmPluginKeys } from "../enums/keys";
import type { DdmPluginsEnabled } from "../types/ddmTypes";

// ===================================================
//                   MANAGER

/**
 * The Core class that manages state.
 */
class CoreManager implements DdmPluginsEnabled {
  Data = DdmDataManager;

  // Enabled Properties
  readonly PM!: boolean;
  readonly NM!: boolean;

  /**
   * A function to set a boolean once and then used for various checks.
   * @param {DdmPluginKeys} toEnable - the plugin script to be enabled, read only after it has been set.
   * @param {boolean} value - the value to be set.
   */
  setEnabled(toEnable: DdmPluginKeys, value: boolean) {
    Object.defineProperty(this, toEnable, {
      value,
      writable: false,
      configurable: true,
    });
  }
  // End Enabled Properties

  // GameState
  #gameState: DdmGameState = "empty";

  get gameState() {
    return this.#gameState;
  }

  set gameState(newState: DdmGameState) {
    if (GameState.includes(newState)) {
      this.#gameState = newState;
    }
    if (this.NM && DdmApi.NM) DdmApi.NM.tickState(newState);
  }
  // End GameState

  isWindowFocused() {
    return isWinFocus();
  }
}

const DdmCoreManager = new CoreManager();
type DdmCoreManagerType = CoreManager;

// ===================================================
//                    EXPORT

export { DdmCoreManager };
export type { DdmCoreManagerType };
