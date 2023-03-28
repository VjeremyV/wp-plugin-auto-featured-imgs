<?php 

    // Method: POST, PUT, GET etc
    // Data: array("param" => "value") ==> index.php?param=value
    

function call_API_Envato($url)
{
    $ch= curl_init();
    $authorization = "Authorization: Bearer nJ20uF5k72dTHVrsNDa8VTS1xHNSP1LB"; // Prepare the authorisation token


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
