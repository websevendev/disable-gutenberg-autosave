=== Disable Gutenberg Autosave ===
Contributors: websevendev
Tags: gutenberg, autosave
Requires at least: 4.9.8
Tested up to: 6.0
Requires PHP: 5.4
Stable tag: 1.0.11
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Allows to control Gutenberg autosave interval or disable autosave completely.

== Description ==

By activating this plugin autosave feature in the Gutenberg editor will be disabled. Alternatively it also provides options in the editor to select a different autosave interval time than the default 60 seconds.

The block editor will still use local autosave that saves a copy of the edited post to your local storage and allows you to restore it if you happened to navigate away without saving.

== Screenshots ==

1. Select block editor plugin
2. Choose the autosave interval

== Changelog ==

= 1.0.11 =
* Update `@wordpress/*` packages.
* Test with WordPress 6.0.

= 1.0.10 =
* Fix first autosave using default interval.
* Mark (WordPress) default autosave interval as 1 min not 10 sec.
* Add button to trigger autosave.
* Add editor status section.
* Fix variable typo.
* Test with WordPress 5.8.
* Use `@wordpress/scripts` for building.

= 1.0.9 =
* Test with WordPress 5.6.
* Add screenshots.

= 1.0.8 =
* Update interval REST route permissions.

= 1.0.7 =
* Remove `.min` from main script file name.
* Remove `file_exists` check from plugin asset loading.

= 1.0.6 =
* Remove `load_plugin_textdomain`.
* Rename compiled script to same as source script.
* Remove path from `wp_set_script_translations`.
* Remove `.pot` file and `languages` dir.
* Use `wp.i18n.__` directly.
* Add textdomain to plugin docblock.

= 1.0.5 =
* Use `wp_set_script_translations`.
* Use `wp.element.Fragment` instead of `React.Fragment`.

= 1.0.4 =
* Don't use inline if.

= 1.0.3 =
* Don't use WordPress 5.0 locale function when not available.

= 1.0.2 =
* Use WordPress 5.0 locale function.

= 1.0.1 =
* Update slug and textdomain.

= 1.0.0 =
* Initial release.
