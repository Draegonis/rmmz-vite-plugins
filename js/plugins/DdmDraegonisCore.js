//-----------------------------------------------------------------------------
/*:
 * @plugindesc 0.10 Core script to enable Ddm Draegonis Rmmz Vite Plugins.
 * @target MZ
 * @url
 * @author Ddm Draegonis
 *
 * @param enabled
 * @text Enabled Plugins
 *
 * @param PM
 * @text Persist Manager
 * @type boolean
 * @default false
 * @on Enable
 * @off Disable
 * @parent enabled
 *
 * @param NM
 * @text Node Manager
 * @type boolean
 * @default false
 * @on Enable
 * @off Disable
 * @parent enabled
 *
 * @command forceSave
 * @text Force Save
 * @desc With this you can make a backup.
 *
 * @arg id
 * @text ID
 * @type string
 * @default "backup"
 * @desc The string or number ID of the save.
 *
 * @command forceLoad
 * @text Force Load
 * @desc With this you can load a backup.
 *
 * @arg id
 * @text ID
 * @type string
 * @default "backup"
 * @desc The string or number ID of the save.
 *
 * @help
 * Installation instructions and other information can be found in
 * DdmDraegonis.docx.
 *
 * Core script must be above all other DdmDraegonis scripts in the plugin
 * manager.
 *
 * In the parameters can you enable and disable the components.
 *
 * Released under the MIT License.
 */
var Imported = Imported || {};
Imported.DdmDraegonisCore = 0.1;

DdmApi.rmmzInit = true;
DdmApi.init.Core({
  ...PluginManager.parameters("DdmDraegonisCore"),
  type: "Core",
});

PluginManager.registerCommand("DdmDraegonisCore", "forceSave", ({ id }) => {
  if (!DdmApi.Core) return;
  DdmApi.Core.Data.onSave(id);
});
PluginManager.registerCommand("DdmDraegonisCore", "forceLoad", ({ id }) => {
  if (!DdmApi.Core) return;
  DdmApi.Core.Data.onLoad(id);
});

// ******** Plugin Body ********
(() => {
  if (!DdmApi.Core) {
    throw new Error(
      "DdmApi.Core did not initialize, please check your project to see if you installed the script properly."
    );
  }

  const DdmCore_Local = {
    Alias: {
      Scene_Save: {
        onSaveSuccess: Scene_Save.prototype.onSaveSuccess,
      },
      Scene_Load: {
        onLoadSuccess: Scene_Load.prototype.onLoadSuccess,
      },
      Scene_Base: {
        initialize: Scene_Base.prototype.initialize,
        start: Scene_Base.prototype.start,
        onAutosaveSuccess: Scene_Base.prototype.onAutosaveSuccess,
      },
      Scene_Title: {
        initialize: Scene_Title.prototype.initialize,
      },
      Scene_Map: {
        initialize: Scene_Map.prototype.initialize,
      },
      Scene_Battle: {
        initialize: Scene_Battle.prototype.initialize,
      },
      Scene_MenuBase: {
        initialize: Scene_MenuBase.prototype.initialize,
      },
      Scene_Shop: {
        initialize: Scene_Shop.prototype.initialize,
      },
    },
  };
  // Make custom save in indexeddb.
  Scene_Save.prototype.onSaveSuccess = function () {
    DdmNM_Local.Alias.Scene_Save.onSaveSuccess.call(this);
    DdmApi.Core.Data.onSave(this.savefileId());
  };
  Scene_Base.prototype.onAutosaveSuccess = function () {
    DdmNM_Local.Alias.Scene_Base.onAutosaveSuccess.call(this);
    DdmApi.Core.Data.onSave(0);
  };
  Scene_Load.prototype.onLoadSuccess = function () {
    DdmApi.Core.Data.onLoad(this.savefileId());
    DdmNM_Local.Alias.Scene_Load.onLoadSuccess.call(this);
  };
  // State Management =========
  Scene_Base.prototype.initialize = function () {
    DdmCore_Local.Alias.Scene_Base.initialize.call(this);
    this._ddmState = "empty";
  };

  Scene_Title.prototype.initialize = function () {
    DdmCore_Local.Alias.Scene_Title.initialize.call(this);
    this._ddmState = "title";
  };

  Scene_Map.prototype.initialize = function () {
    DdmCore_Local.Alias.Scene_Map.initialize.call(this);
    this._ddmState = "map";
  };

  Scene_Battle.prototype.initialize = function () {
    DdmCore_Local.Alias.Scene_Battle.initialize.call(this);
    this._ddmState = "battle";
  };

  Scene_MenuBase.prototype.initialize = function () {
    DdmCore_Local.Alias.Scene_MenuBase.initialize.call(this);
    this._ddmState = "menu";
  };

  Scene_Shop.prototype.initialize = function () {
    DdmCore_Local.Alias.Scene_Shop.initialize.call(this);
    this._ddmState = "shop";
  };

  Scene_Base.prototype.start = function () {
    if (DdmApi.Core) DdmApi.Core.gameState = this._ddmState;
    DdmCore_Local.Alias.Scene_Base.start.call(this);
  };
  // End of State Management =====
})();
