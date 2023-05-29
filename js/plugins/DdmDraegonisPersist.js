//-----------------------------------------------------------------------------
/*:
 * @plugindesc 0.10 Ddm Draegonis Rmmz Vite Plugins Persist Manager Script.
 * @target MZ
 * @url
 * @author Ddm Draegonis
 *
 * @base DdmDraegonisCore
 * @orderAfter DdmDraegonisCore
 *
 * @param dev
 * @text Developer Options
 *
 * @param refresh
 * @text Refresh Store
 * @desc If this is on it will reset the store to initial values. Good for testing/developing.
 * @type boolean
 * @default false
 * @on Enable
 * @off Disable
 * @parent dev
 *
 * @help
 * Installation instructions and other information can be found in
 * DdmDraegonis.docx.
 *
 * This script must be placed under DdmDraegonisCore.js
 *
 * Released under the MIT License.
 */
var Imported = Imported || {};
Imported.DdmDraegonisPersist = 0.1;

if (!Imported.DdmDraegonisCore)
  throw new Error(
    "DdmDraegonisPersist.js must be below DdmDraegonisCore.js in the plugin manager."
  );

DdmApi.init.PM({
  ...PluginManager.parameters("DdmDraegonisPersist"),
  type: "PM",
});

// ******** Plugin Body ********
(() => {
  if (!DdmApi.Core.PM) return;

  const DdmPM_Local = {
    Alias: {
      DataManager: {
        makeSaveContents: DataManager.makeSaveContents,
        extractSaveContents: DataManager.extractSaveContents,
      },
      Scene_Boot: {
        start: Scene_Boot.prototype.start,
      },
    },
  };

  // Add to the Game Save.
  DataManager.makeSaveContents = function () {
    const contents = DdmPM_Local.Alias.DataManager.makeSaveContents.call(this);
    contents.DDMPM_id = DdmApi.PM.onSave();
    return contents;
  };
  DataManager.extractSaveContents = function (contents) {
    DdmPM_Local.Alias.DataManager.extractSaveContents.call(this, contents);
    DdmApi.PM.onLoad(contents.DDMPM_id);
  };
  // Load persisted data on boot, this is mostly to get access to DdmApi.PM.custom
  // for the title screen.
  Scene_Boot.prototype.start = function () {
    DdmPM_Local.Alias.Scene_Boot.start.call(this);
    DdmApi.PM.onLoad("");
  };
})();
