<?php
include_once(__DIR__.'/Request_API.php');
define('AFI_DBNAME', $wpdb->prefix . 'wa_AFI_keys');
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
        'callback' => 'AFI_add_apikeys',
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

function AFI_get_translate_routes(){
    register_rest_route('AFI/v1', '/get_translate', [
        'methods' => 'GET', 
        'callback' => function(){
            return get_translate();
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


function get_translate(){
    $text = $_GET['text'];
    global $wpdb;
        $request = 'SELECT *  FROM '. AFI_DBNAME. ' WHERE `service` = \'deepl\'';
        $data= $wpdb->get_results(
            $wpdb->prepare($request)
        );
        $apiKey = $data[0]->clef;
    //informations endpoint API
    $url = 'https://api-free.deepl.com/v2/translate';

    //on renvoie le resultat du call API
    return json_decode(call_API_Deepl($url, $apiKey, $text));
}




function AFI_get_missing_featured_imgs_articles (){
    global $wpdb;
//SELECT * FROM `wp_posts` as p WHERE NOT EXISTS (select *  from `wp_postmeta` as m where m.post_id=p.ID and  meta_key = '_thumbnail_id') and `post_type`="post" AND post_date_gmt != '0000-00-00 00:00:00';
    $request = 'SELECT ID, post_title  FROM '. $wpdb->prefix . 'posts as p WHERE NOT EXISTS (SELECT *  FROM '.$wpdb->prefix .'postmeta as m where m.post_id=p.ID and  meta_key = \'_thumbnail_id\') and `post_type`="post" AND post_status != \'auto-draft\';';
    $data= $wpdb->get_results(
        $wpdb->prepare($request)
    );
    $new_array = [];
    $count = 0;
    foreach($data as $article){
        $article->request = 'request-'.$count;
        $article->include = 'include-'.$count;
        $new_array[] = $article;
        $count++;
    }
    return $new_array;
}

 /**
  * 
  *
  * @param WP_REST_Request $request
  * @return void
  */
function AFI_add_apikeys(WP_REST_Request $request){
    global $wpdb;
    $params= $request->get_params();
    $service = htmlspecialchars($params['service']);
    // return $service;
    $clef = htmlspecialchars($params['clef']);
    
    $req = "SELECT * FROM ". AFI_DBNAME ." WHERE `service` = '".$service."'";
    $result= $wpdb->get_results(
        $wpdb->prepare($req)
    );
    if(count($result) > 0){        
        if($wpdb->update(AFI_DBNAME, [
            'clef'=>$clef]
            , ['id' => $result[0]->id])      
            ){
                
                return 'la cle API a bien été mise à jour';   
            } else {
                return 'la cle API n\'a pas pu être mise à jour';
            }
    } else {
        if($wpdb->query(
            $wpdb->prepare(
            "INSERT INTO ". AFI_DBNAME."
            (service, clef)
            VALUES ( %s, %s)",
                  $service,
                  $clef,           
            )
            )){
                return 'la cle API a bien été créée';  
            } else {
                return 'un problème est survenu lors de l\'enregistrement sur le serveur';
            }
    }

}
    /**
     * récupère les images sur envato
     *
     * @param [string] $text
     * @return mixed
     */
    function GetImgs():mixed{
        global $wpdb;

        $text = $_GET['text'];
        $text = str_replace(' ', '-', $text);
        //informations endpoint API
            $request = 'SELECT *  FROM '. AFI_DBNAME. ' WHERE `service` = \'envato\'';
            $data= $wpdb->get_results(
                $wpdb->prepare($request)
            );
            $apiKey = $data[0]->clef;
        //informations endpoint API
        $url = 'https://api.envato.com/v1/discovery/search/search/item?term='.$text.'&site=photodune.net&orientation=landscape&sort_by=relevance';

        //on renvoie le resultat du call API
        return json_decode(call_API_Envato($url, $apiKey, $text));

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
