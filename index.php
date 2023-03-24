<?php

/**
    Plugin Name: Auto-Featured-imgs
    Description: Complète automatiquement articles n'ayant pas d'images à la une avec une image en rapport avec le h1 de l'article 
    Author: Vaugoyeau Jérémy
    Author URI:       https://github.com/VjeremyV
    Version: 0.1
 */
require_once plugin_dir_path(__FILE__) . 'functions/AFI_functions.php';

// define('TAROT_PLUG_DIR', plugin_dir_url(__FILE__));
add_action('rest_api_init', 'AFI_get_missing_featured_imgs_routes');
add_action( 'admin_menu', 'AFI_addAdminLink' );


