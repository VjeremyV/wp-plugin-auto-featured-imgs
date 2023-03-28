<?php
include_once(__DIR__.'/Request_API.php');
/**
 * ajoute mon menu au panneau d'admin de WP
 *
 * @return void
 */
function AFI_addAdminLink(){
    add_menu_page('Compléter vos images mises en avant manquantes', // Titre de la page
    'Auto-Featured-Imgs', // Texte de l'onglet du menu
    'manage_options', // capacité de l'utilisateur à voir le menu selon son rôle
    __DIR__.'/AFI_menu.php','', 'dashicons-format-gallery' ); // ressource à appeler à l'affichage de la page;
}
    
/**
 * On ajoute la route pour trouver les articles sans images à la une, dans l'api REST de Wordpress
 *
 * @return void
 */
function AFI_get_missing_featured_imgs_routes(){
    register_rest_route('AFI/v1', '/get_missing_articles', [
        'methods' => 'GET', 
        'callback' => function(){
            return AFI_get_missing_featured_imgs_articles();
        }
    ]);
}

function AFI_get_imgs(){
    register_rest_route('AFI/v1', '/AFI_get_imgs', [
        'methods' => 'GET', 
        'callback' => function(){
            return GetImgs();
        },
        'args'=> [
            'text' => [
                'required'=> true,
                'type'=> 'string',
                'description'=> esc_html__('requete de recherche'),
                'sanitize_callback'=> 'sanitize_text_field'
            ]
        ]
    ]);
}

function AFI_get_missing_featured_imgs_articles (){
    global $wpdb;
//SELECT * FROM `wp_posts` as p WHERE NOT EXISTS (select *  from `wp_postmeta` as m where m.post_id=p.ID and  meta_key = '_thumbnail_id') and `post_type`="post" AND post_date_gmt != '0000-00-00 00:00:00';
    $request = 'SELECT ID, post_title  FROM '. $wpdb->prefix . 'posts as p WHERE NOT EXISTS (SELECT *  FROM '.$wpdb->prefix .'postmeta as m where m.post_id=p.ID and  meta_key = \'_thumbnail_id\') and `post_type`="post" AND post_status != \'auto-draft\';';
    $data= $wpdb->get_results(
        $wpdb->prepare($request)
    );
    return $data;
}

 
    /**
     * Spinne un texte donnée via la connexion avec worldai
     *
     * @param [string] $text
     * @return mixed
     */
    function GetImgs():mixed{
        $text = $_GET['text'];
        //informations endpoint API
        $url = 'https://api.envato.com/v1/discovery/search/search/item?term='.$text.'&site=photodune.net&orientation=landscape&sort_by=relevance';
        // $url = '/wp-json/AFI/v1/get_missing_articles';

        // CallAPI($url);
        //on renvoie le resultat du call API
        return json_decode(call_API_Envato($url));

    }