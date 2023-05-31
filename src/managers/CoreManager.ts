// Managers
import { DdmDataManager } from "./Core/DataManager";
import { DdmStateManager } from "./Core/StateManager";
// Enums
import {
  DdmPluginKeys,
  GAMESTATE_SUB_KEYS,
  WEATHER_SUB_KEYS,
  WINDOW_SUB_KEYS,
} from "../enums/keys";
import { GAME_STATE, WEATHER_STATE, WINDOW_STATE } from "../enums/state";
// Types
import type { DdmPluginsEnabled } from "../types/ddmTypes";

// ===================================================
//                   MANAGER

/**
 * The Core class that manages state.
 */
class CoreManager implements DdmPluginsEnabled {
  /**
   * CoreDataManager singleton class.
   */
  Data = DdmDataManager;
  /**
   * DdmStateManager<T> class.
   */
  GameState: DdmStateManager<GAME_STATE, typeof GAMESTATE_SUB_KEYS>;
  WeatherState: DdmStateManager<WEATHER_STATE, typeof WEATHER_SUB_KEYS>;
  WindowState: DdmStateManager<WINDOW_STATE, typeof WINDOW_SUB_KEYS>;

  constructor() {
    this.GameState = new DdmStateManager<GAME_STATE, typeof GAMESTATE_SUB_KEYS>(
      GAME_STATE.EMPTY,
      GAMESTATE_SUB_KEYS
    );

    this.WeatherState = new DdmStateManager<
      WEATHER_STATE,
      typeof WEATHER_SUB_KEYS
    >(WEATHER_STATE.NONE, WEATHER_SUB_KEYS);

    this.WindowState = new DdmStateManager<
      WINDOW_STATE,
      typeof WINDOW_SUB_KEYS
    >(WINDOW_STATE.FOCUS, WINDOW_SUB_KEYS);

    this.addEventListeners();
  }

  // Window Event Listeners
  addEventListeners() {
    window.addEventListener("focus", () => {
      this.WindowState.current = WINDOW_STATE.FOCUS;
    });
    window.addEventListener("blur", () => {
      this.WindowState.current = WINDOW_STATE.BLUR;
    });
  }
  // End Window Event Listeners

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
}

const DdmCoreManager = new CoreManager();
type DdmCoreManagerType = CoreManager;

// ===================================================
//                    EXPORT

export { DdmCoreManager };
export type { DdmCoreManagerType };
