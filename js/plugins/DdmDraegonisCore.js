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

// ******** Plugin Body ********
(() => {
  const DdmCore_Local = {
    Alias: {
      Scene_Base: {
        initialize: Scene_Base.prototype.initialize,
        start: Scene_Base.prototype.start,
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
