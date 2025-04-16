<?php
/**
 * Plugin Name: Disable Gutenberg Autosave
 * Plugin URI: https://wordpress.org/plugins/disable-gutenberg-autosave
 * Description: Allows to disable Gutenberg autosave or change the interval.
 * Version: 1.0.14
 * Requires PHP: 7.4
 * Text Domain: disable-gutenberg-autosave
 * Author: websevendev
 * Author URI: https://github.com/websevendev
 */

namespace wsd\dga;

use WP_REST_Request;
use WP_REST_Server;
use WP_Error;

defined('ABSPATH') || exit;

function_exists('get_plugin_data') || require_once ABSPATH . 'wp-admin/includes/plugin.php';
$dga_plugin = get_plugin_data(__FILE__, false, false);
define('WSD_DGA_VER', $dga_plugin['Version']);

/**
 * Editor assets.
 */
add_action('enqueue_block_editor_assets', function() {

	/** Prevent loading on Widgets editor. */
	if(!wp_script_is('wp-edit-post', 'enqueued')) {
		return;
	}

	$asset = include plugin_dir_path(__FILE__) . 'build/index.asset.php';

	wp_enqueue_style(
		'disable-gutenberg-autosave',
		plugins_url('build/style-index.css', __FILE__),
		[],
		$asset['version'],
		'all'
	);

	wp_enqueue_script(
		'disable-gutenberg-autosave',
		plugins_url('build/index.js', __FILE__),
		$asset['dependencies'],
		$asset['version'],
		true
	);

	wp_set_script_translations('disable-gutenberg-autosave', 'disable-gutenberg-autosave');
});

/**
 * Register settings.
 */
add_action('admin_init', function() {
	register_setting('disable-gutenberg-autosave', 'dga-autosave-interval', ['default' => 99999]);
});

/**
 * Get interval option.
 *
 * @return int
 */
function dga_get_autosave_interval() {
	return (int)get_option('dga-autosave-interval', 99999);
}

/**
 * Set interval option.
 *
 * @param WP_REST_Request $request
 * @return bool|WP_Error
 */
function dga_set_autosave_interval(WP_REST_Request $request) {
	if(!$request->get_param('interval')) {
		return new WP_Error('dga_no_interval', __('No interval specified', 'disable-gutenberg-autosave'), ['status' => 400]);
	}
	return update_option('dga-autosave-interval', (int)$request->get_param('interval'));
}

/**
 * Setup REST API for managing interval option.
 */
add_action('rest_api_init', function() {
	register_rest_route('disable-gutenberg-autosave/v1', '/interval', [
		[
			'methods' => WP_REST_Server::READABLE,
			'callback' => __NAMESPACE__ . '\\dga_get_autosave_interval',
			'permission_callback' => '__return_true',
		],
		[
			'methods' => WP_REST_Server::CREATABLE,
			'callback' => __NAMESPACE__ . '\\dga_set_autosave_interval',
			'args' => [
				'interval' => [
					'validate_callback' => function($param, $request, $key) {
						return is_numeric($param);
					},
				],
			],
			'permission_callback' => function() {
				return current_user_can('manage_options');
			},
		],
	]);
});

/**
 * Apply autosave interval to block editor settings.
 *
 * @param array $settings
 * @return array
 */
add_filter('block_editor_settings_all', function($settings) {
	$settings['autosaveInterval'] = dga_get_autosave_interval();
	return $settings;
});

/**
 * Add GitHub link on the plugins page.
 *
 * @param array $plugin_meta
 * @param string $plugin_file
 * @return array
 */
add_filter('plugin_row_meta', function($plugin_meta, $plugin_file) {
	if($plugin_file === 'disable-gutenberg-autosave/disable-gutenberg-autosave.php') {
		$plugin_meta[] = '<a href="https://github.com/websevendev/disable-gutenberg-autosave" target="_blank" rel="noopener noreferrer">GitHub</a>';
	}
	return $plugin_meta;
}, 10, 2);
