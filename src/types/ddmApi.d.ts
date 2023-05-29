import type { DdmInitApi } from "../api/initApi";
import type { DdmPersistManagerType } from "../managers/PersistManager";
import type { DdmCoreManagerType } from "../managers/CoreManager";
import type { DdmNodeManager } from "../managers/NodeManager";

// ===================================================
//                      API

interface DDMAPI {
  rmmzInit: boolean;
  init: DdmInitApi | undefined;
  Core: DdmCoreManagerType;
  PM: DdmPersistManagerType;
  NM: DdmNodeManager;
}

// ===================================================
//                     GLOBAL

declare global {
  var DdmApi: DDMAPI;
}

export { DDMAPI };
