<?php
wp_enqueue_style('AFI-tarot-css-admin', trailingslashit(PLUG_DIR) . 'assets/css/AFI_admin.css', false, '1.0', 'all');
wp_enqueue_script('ctWA-tarot-admin-js',trailingslashit(PLUG_DIR) . 'assets/js/AFI_admin.js',[], true);


?>

<div class="wrap">
  <h1>Iron-mage</h1>
  <div class="container">

    <button id="generate_thumbnails">Générer les images mises en avant</button>
    <div class="loader"></div>
    <div class="result_fetch"></div>
  </div>
</div>