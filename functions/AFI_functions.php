<?php
include_once(__DIR__.'/Request_API.php');
include_once(__DIR__.'/AFI_file.php');
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
/**
 * On ajoute la route pour trouver sauvegarder les fichiers
 *
 * @return void
 */
function AFI_save_files_routes(){
    register_rest_route('AFI/v1', '/save_file', [
        'methods' => 'POST', 
        'callback' => 'save_file',
        'args'=>array(
            'url'=>array(
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
            'title'=>array(
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
            'post_id'=>array(
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
        )

    ]);
}

/**
 * route qui permet d'appeler l'API de recherche d'images
 *
 * @return void
 */
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


/**
 * Récupère les articles sans images à la une
 *
 * @return void
 */
function AFI_get_missing_featured_imgs_articles (){
    global $wpdb;
    $request = 'SELECT ID, post_title, guid  FROM '. $wpdb->prefix . 'posts as p WHERE NOT EXISTS (SELECT *  FROM '.$wpdb->prefix .'postmeta as m where m.post_id=p.ID and  meta_key = \'_thumbnail_id\') and `post_type`="post" AND post_status != \'auto-draft\';';
    
    $data= $wpdb->get_results(
        $wpdb->prepare($request)
    );
    $new_array = [];
    $count = 0;
    foreach($data as $article){
        $article->request = 'request-'.$count;
        $article->include = 'include-'.$count;
        $request = 'SELECT name from '.$wpdb->prefix .'terms terms join '.$wpdb->prefix .'term_taxonomy t on terms.term_id = t.term_id JOIN '.$wpdb->prefix.'term_relationships r on r.term_taxonomy_id = t.term_taxonomy_id join '.$wpdb->prefix .'posts p on r.object_id = p.ID where p.ID = %s';
        $category = $wpdb->get_results(
            $wpdb->prepare($request, $article->ID)
        );
        $article->category = html_entity_decode($category[0]->name);
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
    $clef = htmlspecialchars($params['clef']);
    
    $req = "SELECT * FROM ". $wpdb->prefix . 'wa_AFI_keys' ." WHERE `service` = %s";
    $result= $wpdb->get_results(
        $wpdb->prepare($req, $service)
    );
    if(count($result) > 0){        
        if($wpdb->update($wpdb->prefix . 'wa_AFI_keys', [
            'clef'=>$clef]
            , ['id' => $result[0]->id])      
            ){
                
                return 'maj';   
            } else {
                return 'fail';
            }
    } else {
        if($wpdb->query(
            $wpdb->prepare("INSERT INTO ". $wpdb->prefix . 'wa_AFI_keys'." (service, clef) VALUES ( %s, %s)", $service, $clef)
            )){
                return 'creation';  
            } else {
                return 'fail';
            }
    }

}
    /**
     * récupère les images sur pixabay
     *
     * @param [string] $text
     * 
     */
    function GetImgs(){
        global $wpdb;

        $text = $_GET['text'];
        $text = str_replace(' ', '+', $text);
        //informations endpoint API
            $request = 'SELECT *  FROM '. $wpdb->prefix . 'wa_AFI_keys'. ' WHERE `service` = \'pixabay\'';
            $data= $wpdb->get_results(
                $wpdb->prepare($request)
            );
            $apiKey = $data[0]->clef;
        //informations endpoint API
        $url = 'https://pixabay.com/api/?key='.$apiKey.'&q='.$text;

        //on renvoie le resultat du call API
        return json_decode(call_API_Pixabay($url));

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

function save_file(WP_REST_Request $request){
    $params= $request->get_params();
    $image_url = htmlspecialchars($params['url']);
    $image_title = htmlspecialchars($params['title']);
    $post_id = htmlspecialchars($params['post_id']);
    $file = Upload_file($image_url, $image_title, $post_id);
    return json_encode($file['id']);
    

}
