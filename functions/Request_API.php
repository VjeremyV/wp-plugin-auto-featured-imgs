<?php 

    // Method: POST, PUT, GET etc
    // Data: array("param" => "value") ==> index.php?param=value
    

function call_API_Envato($url, $apiKey)
{

    $ch= curl_init();
    $authorization = "Authorization: Bearer ".$apiKey; // Prepare the authorisation token

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json' , $authorization )); // Inject the token into the header
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // This will follow any redirects

    $resp = curl_exec($ch);

    if($e = curl_error($ch)){
        return $e;
    } else {
        return $resp;
    }
    curl_close($ch);
}

function call_API_Deepl($url, $apiKey, $text){
    $data_array = [
        'text' => $text,
        'target_lang'=> 'EN'
    ];
    $data= http_build_query($data_array);
    $ch= curl_init();
    $authorization = "Authorization: DeepL-Auth-Key ".$apiKey; // Prepare the authorisation token

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array($authorization)); // Inject the token into the header
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $resp = curl_exec($ch);

    if($e = curl_error($ch)){
        return $e;
    } else {
        return $resp;
    }
    curl_close($ch);
}
