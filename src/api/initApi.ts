// Managers
import { DdmPersistManager } from "../managers/PersistManager";
import { DdmCoreManager } from "../managers/CoreManager";
import { DdmNodeManager } from "../managers/NodeManager";
// Enums
import { GAMESTATE_SUB_KEYS, PluginKeys, WINDOW_SUB_KEYS } from "../enums/keys";
import { TINT_STATE } from "../enums/state";
// Types
import type {
  DdmCoreParams,
  DdmPersistParams,
  DdmInitApi,
  DdmNodeParams,
  DdmAllParams,
  DdmDayTints,
} from "../types/ddmTypes";
import { CALENDAR, TINT_COLOURS } from "../data/defaults/NodeDefaults";

// ===================================================
//                    INITAPI

let totalPlugins: number = 0;
let pluginCount: number = 0;

/**
 * @description Called after loading the non-Core scripts. It increments the pluginCount
 * then deletes the init on the global object once all scripts have loaded.
 */
const loadedPlugin = () => {
  pluginCount++;
  if (totalPlugins === pluginCount) {
    delete DdmApi.init;
    console.log("Api Init has finished.");
  }
};

const isCoreParams = (params: DdmAllParams): params is DdmCoreParams => {
  return (params as DdmCoreParams).type === "Core";
};

const isPersistParams = (params: DdmAllParams): params is DdmPersistParams => {
  return (params as DdmPersistParams).type === "PM";
};

const isNodeParams = (params: DdmAllParams): params is DdmNodeParams => {
  return (params as DdmNodeParams).type === "NM";
};

/**
 * @description A collection of functions to be called to init each part of the api.
 * @type {Record<DdmApiKeys, (params: unknown) => void>}
 */
const initApi: DdmInitApi = {
  Core: (params) => {
    DdmApi.Core = DdmApi.Core || {};
    DdmApi.Core = DdmCoreManager;

    if (isCoreParams(params)) {
      PluginKeys.forEach((key) => {
        const enabled = DdmApi.Core.Data.toBoolean(params[key]);

        DdmApi.Core.setEnabled(key, enabled);
        totalPlugins++;
      });

      console.log("Ddm Draegonis Core Initialized.");
    }
  },
  PM: (params) => {
    if (!DdmApi.Core.PM) return;

    DdmApi.PM = DdmApi.PM || {};
    DdmApi.PM = DdmPersistManager;

    if (isPersistParams(params)) {
      const refresh = DdmApi.Core.Data.toBoolean(params.refresh);

      DdmApi.PM.onStart(refresh).then(() => {
        console.log("Persist Store Initialized.");
      });

      loadedPlugin();
    }
  },
  NM: (params) => {
    if (!DdmApi.Core.NM) return;

    DdmApi.NM = DdmApi.NM || {};

    if (isNodeParams(params)) {
      const { secondsPerTick, calendar } = params;

      const tintColours: { [key: string]: [number, number, number, number] } =
        {};

      Object.keys(TINT_STATE).forEach((key) => {
        const tint = params[key.toLowerCase()];
        if (tint) {
          const colours = DdmApi.Core.Data.toTint(tint);
          if (colours) {
            const { red, green, blue, greyScale } = colours;
            tintColours[key] = [red, green, blue, greyScale];
          } else {
            tintColours[key] = TINT_COLOURS[key];
          }
        }
      });

      DdmApi.NM = new DdmNodeManager(
        DdmApi.Core.Data.toNumber(secondsPerTick),
        DdmApi.Core.Data.toCalendar(calendar) || CALENDAR,
        tintColours as DdmDayTints
      );

      DdmApi.Core.GameState.subscribe(GAMESTATE_SUB_KEYS.NODETICK, (state) => {
        DdmApi.NM.tickState(state);
      });
      DdmApi.Core.WindowState.subscribe(WINDOW_SUB_KEYS.NODETICK, (state) => {
        DdmApi.NM.windowTickState(state);
      });
      console.log("Ddm NodeManager Initialized.");

      loadedPlugin();
    }
  },
};

// ===================================================
//                     EXPORT

export { initApi };
export type { DdmInitApi };
