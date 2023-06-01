# Draegonis Rpg Maker MZ Vite Plugins

A set of Rpg Maker MZ plugins that are bundled by vite js and uses
smaller Plugins for params and commands with some small aliases to
Rpg maker functions.

Notes:

- if you have a mz project in this folder and you use the
  editor and save. You'll need to replace or copy paste from
  the backup package.json in the backup folder.
- so far when building you might need to edit the index.html
  to remove the changed icon and css, and re-add the old tags.
  You can reference the non-dist index.html or backup one.
- this project doesn't include the rmmz files but you can drop
  a project into this folder to be able to run the dev server
  for testing.

If you have DdmDraegonisPersist.js enabled in your projects
plugin manager you will need to have a DdmDraegonisPersist.json
in your data folder. The information in that json is the initial
setup of all the data to be persisted.
