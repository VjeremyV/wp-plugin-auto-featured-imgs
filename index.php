<?php

/**
    Plugin Name: Auto-Featured-imgs
    Description: Complète automatiquement articles n'ayant pas d'images à la une avec une image en rapport avec le h1 de l'article 
    Author: Vaugoyeau Jérémy
    Author URI:       https://github.com/VjeremyV
    Version: 0.1
 */
define('PLUG_DIR', plugin_dir_url(__FILE__));
require_once plugin_dir_path(__FILE__) . 'functions/AFI_functions.php';

register_activation_hook(__FILE__, 'add_DB');
add_action('rest_api_init', 'AFI_get_missing_featured_imgs_routes');
add_action('rest_api_init', 'AFI_add_apikeys_routes');
add_action('rest_api_init', 'AFI_get_imgs_routes');
add_action('rest_api_init', 'AFI_save_files_routes');
add_action('rest_api_init', 'AFI_get_translate_routes');
add_action( 'admin_menu', 'AFI_addAdminLink' );


