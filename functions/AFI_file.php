<?php
$temp_name= '';
/**
 * 
 *
 */
 function Upload_file(string $image_url, string $image_title, string $post_id) {
	global $temp_name; 
	$image_title = preg_replace('/[^A-Za-z0-9\-]/', '', $image_title);
	$temp_name= $image_title;
	// it allows us to use download_url() and wp_handle_sideload() functions
	require_once( ABSPATH . 'wp-admin/includes/file.php' );

	// download to temp dir
	$temp_file = download_url( $image_url );

	if( is_wp_error( $temp_file ) ) {
		return false;
	}

	// move the temp file into the uploads directory
	$file = array(
		'name'     => basename( $image_url ),
		'type'     => mime_content_type( $temp_file ),
		'tmp_name' => $temp_file,
		'size'     => filesize( $temp_file )
		);
	$sideload = wp_handle_sideload(
		$file,
		array(
			'test_form'   => false, // no needs to check 'action' prameter
			'unique_filename_callback' => 'get_new_filename'
			)
	);

	if( ! empty( $sideload[ 'error' ] ) ) {
		// you may return error message if you want
		return false;
	}

	// it is time to add our uploaded image into WordPress media library
	$attachment_id = wp_insert_attachment(
		array(
			'guid'           => $sideload[ 'url' ],
			'post_mime_type' => $sideload[ 'type' ],
			'post_title'     => $image_title,
			'post_content'   => '',
			'post_status'    => 'inherit',
		),
		$sideload[ 'file' ], $post_id 
	);

	if( is_wp_error( $attachment_id ) || ! $attachment_id ) {
		return false;
	}

	// update medatata, regenerate image sizes
	require_once( ABSPATH . 'wp-admin/includes/image.php' );

	wp_update_attachment_metadata(
		$attachment_id,
		wp_generate_attachment_metadata( $attachment_id, $sideload[ 'file' ] )
	);


	//ajout du lien entre l'image et l'article pour que l'image soit à la une de l'article
	global $wpdb;
	$wpdb->insert($wpdb->prefix.'postmeta', array('post_id' => $post_id, 'meta_key' => '_thumbnail_id', 'meta_value' => $attachment_id));

	$directory = explode('/', $sideload[ 'file' ]);
    $file = array_pop($directory);


	$response = [
		'fileName' => $file,
		'directory' => $directory,
		'id'=> $attachment_id,
		'filename' => $image_title.'.jpg'
 ];

	return $response ;
}

 function get_new_filename(){
	global $temp_name;
	return $temp_name.'.jpg';
}


function deleteSpecialChar(string $str){
	// remplacer tous les caractères spéciaux par une chaîne vide
    $res = str_replace( array( '%', '@', '\'', ';', '<', '>', ':', '"', ',' , '!', '?', '&' ), '', $str);
      
    return $res;
}
