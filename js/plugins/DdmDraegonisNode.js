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
 * @param secondsPerTick
 * @text Seconds Per Game Tick
 * @desc The amount of seconds until the node manager increments the game tick.
 * @type number
 * @default 60
 * @min 10
 * @parent settings
 *
 * @param calendar
 * @text Calendar
 * @desc The structure of the calendar to be used in the game.
 * @type struct<Calendar>
 * @parent settings
 *
 * @param tints
 * @text Day Tints
 * @parent settings
 *
 * @param dawn
 * @text Dawn
 * @type struct<TintColour>
 * @parent tints
 *
 * @param normal
 * @text Normal
 * @type struct<TintColour>
 * @parent tints
 *
 * @param dusk
 * @text Dusk
 * @type struct<TintColour>
 * @parent tints
 *
 * @param cloudy
 * @text Cloudy
 * @type struct<TintColour>
 * @parent tints
 *
 * @param night
 * @text Night
 * @type struct<TintColour>
 * @parent tints
 *
 * @command switch_Event
 * @text Switch Event
 * @desc Schedule an update of a game switch.
 *
 * @arg id
 * @text ID
 * @type string
 * @default "Unique ID"
 * @desc The unique ID of the event.
 *
 * @arg tick
 * @text Tick
 * @type number
 * @default 1
 * @min 1
 * @desc The amount of ticks before the event is executed.
 *
 * @arg isTrackable
 * @text Is Trackable
 * @type boolean
 * @default false
 * @desc Is the event trackable, added to an object that keeps record and all trackable events.
 *
 * @arg switchId
 * @text Switch Id
 * @type switch
 * @default 1
 * @min 1
 * @desc The game switch to change the value of.
 *
 * @arg newValue
 * @text New Value
 * @type boolean
 * @default false
 * @desc The new value of the game switch.
 *
 * @command variable_Event
 * @text Variable Event
 * @desc Schedule an update of a game variable, it will go with the first new value given.
 *
 * @arg id
 * @text ID
 * @type string
 * @default "Unique ID"
 * @desc The unique ID of the event.
 *
 * @arg tick
 * @text Tick
 * @type number
 * @default 1
 * @min 1
 * @desc The amount of ticks before the event is executed.
 *
 * @arg isTrackable
 * @text Is Trackable
 * @type boolean
 * @default false
 * @desc Is the event trackable, added to an object that keeps record and all trackable events.
 *
 * @arg variableId
 * @text Variable Id
 * @type variable
 * @default 1
 * @min 1
 * @desc The game variable to change the value of.
 *
 * @arg newNumber
 * @text New Number Value
 * @type number
 * @desc The new number value of the game valriable.
 *
 * @arg newNumberArray
 * @text New Number Array
 * @type number[]
 * @desc The new number array value of the game variable.
 *
 * @arg newString
 * @text New String
 * @type string
 * @desc The new string value of the game variable.
 *
 * @arg newStringArray
 * @text New String Array
 * @type string[]
 * @desc The new string array value of the game variable.
 *
 * @command selfSW_Event
 * @text Self Switch Event
 * @desc Schedule an update of a self switch. Note: The self switch must already have been used.
 *
 * @arg id
 * @text ID
 * @type string
 * @default "Unique ID"
 * @desc The unique ID of the event.
 *
 * @arg tick
 * @text Tick
 * @type number
 * @default 1
 * @min 1
 * @desc The amount of ticks before the event is executed.
 *
 * @arg isTrackable
 * @text Is Trackable
 * @type boolean
 * @default false
 * @desc Is the event trackable, added to an object that keeps record and all trackable events.
 *
 * @arg mapID
 * @text Map ID
 * @type number
 * @default 1
 * @min 1
 * @desc The map ID where the event is located.
 *
 * @arg eventID
 * @text Event ID
 * @type number
 * @default 1
 * @min 1
 * @desc The event ID to have their self switch modified.
 *
 * @arg switchID
 * @text Switch ID
 * @type string
 * @default "A"
 * @desc The switch ID letter to be changed.
 *
 * @command tint_Event
 * @text Tint Event
 * @desc Schedule a screen tint event.
 *
 * @arg id
 * @text ID
 * @type string
 * @default "Unique ID"
 * @desc The unique ID of the event.
 *
 * @arg tick
 * @text Tick
 * @type number
 * @default 1
 * @min 1
 * @desc The amount of ticks before the event is executed.
 *
 * @arg isTrackable
 * @text Is Trackable
 * @type boolean
 * @default false
 * @desc Is the event trackable, added to an object that keeps record and all trackable events.
 *
 * @arg tint
 * @text Event ID
 * @type select
 * @option dawn
 * @value "DAWN"
 * @option normal
 * @value "NORMAL"
 * @option cloudy
 * @value "CLOUDY"
 * @option dusk
 * @value "DUSK"
 * @option night
 * @value "NIGHT"
 * @default normal
 * @desc A tint from the tint setting.
 *
 * @arg frames
 * @text Frames
 * @type number
 * @default 1
 * @min 1
 * @desc The amount of frames it takes to switch to the tint.
 *
 * @command weather_Event
 * @text Weather Event
 * @desc Schedule a gameScreen changeWeather event.
 *
 * @arg id
 * @text ID
 * @type string
 * @default "Unique ID"
 * @desc The unique ID of the event.
 *
 * @arg tick
 * @text Tick
 * @type number
 * @default 1
 * @min 1
 * @desc The amount of ticks before the event is executed.
 *
 * @arg isTrackable
 * @text Is Trackable
 * @type boolean
 * @default false
 * @desc Is the event trackable, added to an object that keeps record and all trackable events.
 *
 * @arg weatherType
 * @text Weather Type
 * @type select
 * @option none
 * @value "NONE"
 * @option rain
 * @value "RAIN"
 * @option storm
 * @value "STORM"
 * @option snow
 * @value "SNOW"
 * @default none
 * @desc The new weather state.
 *
 * @arg power
 * @text Power
 * @type number
 * @default 1
 * @min 1
 * @desc The power of the weather normally 1-9.
 *
 * @arg frames
 * @text Frames
 * @type number
 * @default 1
 * @min 1
 * @desc The amount of frames it takes for the weather to change.
 *
 * @arg newValue
 * @text New Value
 * @type boolean
 * @default false
 * @desc The new value of the self switch of map ID / event ID.
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
/*~struct~TintColour:
 *
 * @param red
 * @text Red
 * @type number
 * @default 0
 * @min -255
 * @max 255
 *
 * @param green
 * @text Green
 * @type number
 * @default 0
 * @min -255
 * @max 255
 *
 * @param blue
 * @text Blue
 * @type number
 * @default 0
 * @min -255
 * @max 255
 *
 * @param greyScale
 * @text Grey Scale
 * @type number
 * @default 0
 * @min 0
 * @max 255
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

PluginManager.registerCommand("DdmDraegonisNode", "switch_Event", (args) => {
  DdmApi.Core.Data.toSchedule("switch", args);
});
PluginManager.registerCommand("DdmDraegonisNode", "variable_Event", (args) => {
  DdmApi.Core.Data.toSchedule("variable", args);
});
PluginManager.registerCommand("DdmDraegonisNode", "selfSW_Event", (args) => {
  DdmApi.Core.Data.toSchedule("selfSwitch", args);
});
PluginManager.registerCommand("DdmDraegonisNode", "tint_Event", (args) => {
  DdmApi.Core.Data.toSchedule("tint", args);
});
PluginManager.registerCommand("DdmDraegonisNode", "weather_Event", (args) => {
  DdmApi.Core.Data.toSchedule("weather", args);
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
