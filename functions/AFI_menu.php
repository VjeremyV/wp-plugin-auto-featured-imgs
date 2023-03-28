<?php
wp_enqueue_style('AFI-tarot-css-admin', trailingslashit(PLUG_DIR) . 'assets/css/AFI_admin.css', false, '1.0', 'all');
wp_enqueue_script('ctWA-tarot-admin-js', trailingslashit(PLUG_DIR) . 'assets/js/AFI_admin.js', [], true);


?>

<div class="wrap">
  <h1>Iron-mage</h1>

  <form id="form" class="container">
    <label for="siteSource">Choisir la source de l'image</label>

    <div class="loader"></div>
    <div class="result_fetch"></div>
    <input type="text" name="test" id="test">
    <input type="submit" value="Générer les images mises en avant">
  </form>
</div>

<script>
  let api = "<?=API_ENVATO?>";
</script>