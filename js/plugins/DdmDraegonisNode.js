//-----------------------------------------------------------------------------
/*:
 * @plugindesc 0.10 Ddm Draegonis Rmmz Vite Plugins Node Manager Script.
 * @target MZ
 * @url
 * @author Ddm Draegonis
 *
 * @base DdmDraegonisCore
 * @orderAfter DdmDraegonisCore
 *
 * @param settings
 * @text Settings
 *
 * @param calender
 * @text Calender
 * @desc The structure of the calender to be used in the game.
 * @type struct<Calender>
 * @parent settings
 *
 * @param secondsPerTick
 * @text Seconds Per Game Tick
 * @desc The amount of seconds until the node manager increments the game tick.
 * @type number
 * @default 60
 * @min 10
 *
 * @param dev
 * @text Developer Options
 *
 * @command sceduleEvent
 * @text Schedule Event
 * @desc Schedule an update to happen.
 *
 * @arg text
 * @text Text
 * @type note
 * @default ""
 * @desc
 *
 * @command start
 * @text Start Node Tick
 * @desc Start the Node Tick, it will resume to the closest second round down.
 *
 * @command stop
 * @text Stop Node Tick
 * @desc Stop the Node Tick from running, no scheduled events will be updated/consumed.
 *
 * @command resumeAuto
 * @text Resume Auto Tick
 * @desc Resumes the automatic tick start/stop when switching scenes.
 *
 * @command pauseAuto
 * @text Pause Auto Tick
 * @desc Pauses the automatic tick start/stop when switching scenes.
 *
 * @command saveEvents
 * @text Forced Save
 * @desc Force a save of node event data to the given save ID.
 *
 * @arg id
 * @text Save ID
 * @type string
 * @default "default"
 * @desc The ID that the node event data is going to be saved to.
 *
 * @command loadEvents
 * @text Forced Load
 * @desc Force a load of data with save ID.
 *
 * @arg id
 * @text Save ID
 * @type string
 * @default "default"
 * @desc The ID that the node event data was saved to.
 *
 * @command clearEvents
 * @text Force Clear Events
 * @desc Force a clear of all current scheduled events.
 *
 * @help
 * Installation instructions and other information can be found in
 * DdmDraegonis.docx.
 *
 * This script must be placed under DdmDraegonisCore.js
 *
 * This plugin saves the data into its own save in indexeddb during saving/loading a game.
 *
 * Released under the MIT License.
 */
/*~struct~Calender:
 *
 * @param days
 * @text Day Names
 * @desc The name of each day in the week starting from the first day in the week.
 * @type string[]
 * @default []
 *
 * @param months
 * @text Month Names
 * @desc The name of each month in the year starting from the first month in the year.
 * @type string[]
 * @default []
 *
 * @param weeksInMonth
 * @text Weeks in a Month
 * @desc The number of weeks in a month.
 * @type number
 * @default 1
 * @min 1
 *
 */
var Imported = Imported || {};
Imported.DdmDraegonisNode = 0.1;

if (!Imported.DdmDraegonisCore)
  throw new Error(
    "DdmDraegonisNode.js must be below DdmDraegonisCore.js in the plugin manager."
  );

DdmApi.init.NM({
  ...PluginManager.parameters("DdmDraegonisNode"),
  type: "NM",
});

PluginManager.registerCommand("DdmDraegonisNode", "sceduleEvent", (args) => {
  //
});
PluginManager.registerCommand("DdmDraegonisNode", "start", () => {
  DdmApi.NM.start();
});
PluginManager.registerCommand("DdmDraegonisNode", "stop", () => {
  DdmApi.NM.stop();
});
PluginManager.registerCommand("DdmDraegonisNode", "resumeAuto", () => {
  DdmApi.NM.resumeAutoTick();
});
PluginManager.registerCommand("DdmDraegonisNode", "pauseAuto", () => {
  DdmApi.NM.pauseAutoTick();
});
PluginManager.registerCommand("DdmDraegonisNode", "saveEvents", ({ id }) => {
  DdmApi.NM.onSave(id);
});
PluginManager.registerCommand("DdmDraegonisNode", "loadEvents", ({ id }) => {
  DdmApi.NM.onLoad(id);
});
PluginManager.registerCommand("DdmDraegonisNode", "clearEvents", () => {
  DdmApi.NM.clearEvents();
});

// ******** Plugin Body ********
(() => {
  if (!DdmApi.Core.NM) return;

  const DdmNM_Local = {
    Alias: {
      Scene_Save: {
        onSaveSuccess: Scene_Save.prototype.onSaveSuccess,
      },
      Scene_Base: {
        onAutosaveSuccess: Scene_Base.prototype.onAutosaveSuccess,
      },
      Scene_Load: {
        onLoadSuccess: Scene_Load.prototype.onLoadSuccess,
      },
      DataManager: {
        saveGame: DataManager.saveGame,
        loadGame: DataManager.loadGame,
      },
      Scene_Title: {
        create: Scene_Title.prototype.create,
      },
    },
  };

  // Make custom save in indexeddb.
  Scene_Save.prototype.onSaveSuccess = function () {
    DdmNM_Local.Alias.Scene_Save.onSaveSuccess.call(this);
    DdmApi.NM.onSave(this.savefileId());
  };
  Scene_Base.prototype.onAutosaveSuccess = function () {
    DdmNM_Local.Alias.Scene_Base.onAutosaveSuccess.call(this);
    DdmApi.NM.onSave(0);
  };
  Scene_Load.prototype.onLoadSuccess = function () {
    DdmApi.NM.onLoad(this.savefileId());
    DdmNM_Local.Alias.Scene_Load.onLoadSuccess.call(this);
  };
  // Clear events when you go to the title screen.
  Scene_Title.prototype.create = function () {
    DdmApi.NM.clearEvents();
    DdmNM_Local.Alias.Scene_Title.create.call(this);
  };
})();
