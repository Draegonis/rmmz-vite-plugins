// Managers
import { DdmDataManager } from "./Core/DataManager";
import { DdmStateManager } from "./Core/StateManager";
// Enums
import {
  DdmPluginKeys,
  GameStateSubKeys,
  WeatherStateSubKeys,
  WindowStateSubKeys,
} from "../enums/keys";
// Types
import type {
  DdmGameState,
  DdmWeatherState,
  DdmWindowState,
} from "../enums/state";
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
  GameState: DdmStateManager<DdmGameState>;
  WeatherState: DdmStateManager<DdmWeatherState>;
  WindowState: DdmStateManager<DdmWindowState>;

  constructor() {
    this.GameState = new DdmStateManager<DdmGameState>(
      "empty",
      GameStateSubKeys
    );
    this.WeatherState = new DdmStateManager<DdmWeatherState>(
      "none",
      WeatherStateSubKeys
    );
    this.WindowState = new DdmStateManager<DdmWindowState>(
      "focus",
      WindowStateSubKeys
    );
    this.addEventListeners();
  }

  // Window Event Listeners
  addEventListeners() {
    window.addEventListener("focus", () => {
      this.WindowState.current = "focus";
    });
    window.addEventListener("blur", () => {
      this.WindowState.current = "blur";
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
