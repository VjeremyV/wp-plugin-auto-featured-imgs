<?php
include_once(__DIR__.'/Request_API.php');
// define('AFI_DBNAME', $wpdb->prefix . 'wa_AFI_keys');
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
        },
    ]);
}

/**
 * On ajoute la route pour trouver les articles sans images à la une, dans l'api REST de Wordpress
 *
 * @return void
 */
function AFI_add_apikeys_routes(){
    register_rest_route('AFI/v1', '/add_API', [
        'methods' => 'POST', 
        'callback' => function(){
            return AFI_add_apikeys();
        },
        'args'=>array(
            'service'=>array(
                'type'=>'string',
                'required'=> true,
                'validate_callback'=>function($param){
                    if(empty($param)){
                        return false;
                    } else {
                        return true;
                    }
                }
            ),
            'clef'=>array(
                'type'=>'string',
                'required'=> true,
                'validate_callback'=>function($param){
                    if(empty($param)){
                        return false;
                    } else {
                        return true;
                    }
                }
            )
        )

    ]);
}

function AFI_get_imgs_routes(){
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

 
function AFI_add_apikeys(WP_REST_Request $request){
    $params= $request->get_params();
    global $wpdb;
    $service = htmlspecialchars($params['service']);
    $clef = htmlspecialchars($params['clef']);


    if($wpdb->query(
        $wpdb->prepare(
        "INSERT INTO ". AFI_DBNAME."
        (service, clef)
        VALUES ( %s, %s)",
              $service,
              $clef,           
        )
        )){
        echo 'clef API renseignée';
        } else {
            echo 'un problème est survenu lors de l\'enregistrement sur le serveur';
        }
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

        //on renvoie le resultat du call API
        return json_decode(call_API_Envato($url));

    }


        /**
 * ajoute la table personnalisée en bdd
 */
function add_DB()
{    /**
     * Si inexistante, on créée la table SQL "commissions" après l'activation du thème
     */
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();


    $request = "CREATE TABLE IF NOT EXISTS ". $wpdb->prefix . 'wa_AFI_keys'." (
    id int(255) NOT NULL AUTO_INCREMENT,
    service varchar(255) NOT NULL,
    clef varchar(255) NOT NULL,
    PRIMARY KEY  (id)
) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

    dbDelta($request);
}
