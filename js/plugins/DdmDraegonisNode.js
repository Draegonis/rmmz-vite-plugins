//-----------------------------------------------------------------------------
/*:
 * @plugindesc 0.30 Ddm Draegonis Rmmz Vite Plugins Node Manager Script.
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
 * @param calendar
 * @text Calendar
 * @desc The structure of the calendar to be used in the game.
 * @type struct<Calendar>
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
/*~struct~Calendar:
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
Imported.DdmDraegonisNode = 0.3;

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
PluginManager.registerCommand("DdmDraegonisNode", "clearEvents", () => {
  DdmApi.NM.clearEvents();
});

// ******** Plugin Body ********
(() => {
  if (!DdmApi.Core.NM) return;

  const DdmNM_Local = {
    Alias: {
      Scene_Title: {
        create: Scene_Title.prototype.create,
      },
    },
  };
  // Clear events when you go to the title screen.
  Scene_Title.prototype.create = function () {
    DdmApi.NM.clearEvents();
    DdmNM_Local.Alias.Scene_Title.create.call(this);
  };
})();
