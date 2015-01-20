/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

/**
* Brackets extension to reposition Working Files in sidebar and make it resizable.
*
* Hugo Pessotti <hpessotti@gmail.com>
**/
define(function (require, exports, module) {
	"use strict";

	var Resizer = brackets.getModule("utils/Resizer");

	var CommandManager = brackets.getModule("command/CommandManager"),
		Menus = brackets.getModule("command/Menus"),
		PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
		prefs = PreferencesManager.getExtensionPrefs("resizeBottomWorkingFiles"),
		menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);

	// fix width of current working file selection when resizing the working files panel
	var sidebar_selection = $('.sidebar-selection');
	sidebar_selection[0].style.setProperty('width','100%','important');

	// menu handlers
	CommandManager.register("Bottom Working Files", 'pessotti.bottom-working-files', function() {
		prefs.set('bottomWorkingFiles', !prefs.get('bottomWorkingFiles'));
		prefs.save();
	});
	menu.addMenuItem('pessotti.bottom-working-files');

	CommandManager.register("Resizable Working Files", 'pessotti.resize-working-files', function() {
		prefs.set('resizeWorkingFiles', !prefs.get('resizeWorkingFiles'));
		prefs.save();
	});
	menu.addMenuItem('pessotti.resize-working-files');

	// set handlers when preferences are changed
	prefs.definePreference('bottomWorkingFiles', 'boolean', 'true').on('change', function() {
		CommandManager.get('pessotti.bottom-working-files').setChecked(prefs.get('bottomWorkingFiles'));

		if (prefs.get('bottomWorkingFiles')) {
			$("#sidebar").append($('#working-set-list-container'));

			if (prefs.get('resizeWorkingFiles')) {
				Resizer.removeSizable($('#working-set-list-container'));
				Resizer.makeResizable($('#working-set-list-container'), "vert", "top", 75);
			}
		}
		else {
			$("#sidebar").prepend($('#working-set-list-container'));

			if (prefs.get('resizeWorkingFiles')) {
				Resizer.removeSizable($('#working-set-list-container'));
				Resizer.makeResizable($('#working-set-list-container'), "vert", "bottom", 75);
			}
		}
	});

	prefs.definePreference('resizeWorkingFiles', 'boolean', 'true').on('change', function() {
		CommandManager.get('pessotti.resize-working-files').setChecked(prefs.get('resizeWorkingFiles'));

		Resizer.removeSizable($('#working-set-list-container'));

		if (prefs.get('resizeWorkingFiles')) {
			if (prefs.get('bottomWorkingFiles'))
				Resizer.makeResizable($('#working-set-list-container'), "vert", "top", 75);
			else
				Resizer.makeResizable($('#working-set-list-container'), "vert", "bottom", 75);
		}
	});
});