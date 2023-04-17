<?php
require_once(__DIR__.'/AFI_functions.php');
wp_enqueue_style('AFI-css-admin', trailingslashit(PLUG_DIR) . 'assets/css/AFI_admin.css', false, '1.0', 'all');
wp_enqueue_script('AFI-animation-js', trailingslashit(PLUG_DIR) . 'assets/js/AFI_animation.js', [], true);
wp_enqueue_script('AFI-accordion-js', trailingslashit(PLUG_DIR) . 'assets/js/AFI_accordion.js', [], true);



?>

<div class="wrap">
  <h1>Iron-mage</h1>
  <h2 class="accordion">Clé API <span id="accordionIcon" class="dashicons dashicons-arrow-down-alt2"></span></h2>
  <div id="apiKeysContainer" class="panel">
    <form id="pixabayAPIForm">
      <h3>Pixabay</h3>
      <input type="password" name="pixabayAPI" id="pixabayAPI" value = '<?= is_pixabayApiKay_exists() ? "*********" : ""?>'>
      <div class="showPwd">
        <input type="checkbox" id="showpwdPixabay">
        <label for="showpwdPixabay">Voir la clé</label>
      </div>
      <input type="submit" value="mettre à jour">
    </form>
  </div>
  <div id="Container">
    <form id="generateImgs" class="container">
      <input type="submit" value="Chercher les articles sans images mises en avant">
    </form>
  </div>
  <div class="endScreen"></div>
  <div class="messages"></div>
  <div id="animationContainer">

  </div>

  <table id="missingFeaturedArticles">
    <thead id="missingFeaturedArticleThead">
      <tr>
        <th>
          <input type="checkbox" name="selectAll" id="selectAll-1" class='selectAll'>
          <label for="selectAll-1">Selectionner tous les articles</label>
        </th>
        <th id="categories">
        </th>
        <th>H1 des articles</th>
        <th class="submitContainer">
          <input type="submit" class="submitToApiBtn" value="Envoyer">
          <input type="text" name="fullfill" id="fullfill" placeholder="requête commune">
        </th>
      </tr>
    </thead>
    <thead id="resultImgsThead">
      <tr>
        <th>
          <input type="checkbox" name="selectAll" id="selectAll-2" class='selectAll'>
          <label for="selectAll-2">Selectionner tous les articles</label>
        </th>
        <th>Catégorie</th>
        <th>H1 de l'article</th>
        <th class="submitContainer"><span>Images trouvées</span>
          <input type="submit" class="imgsValidationBtn" value="Valider les images">
        </th>
      </tr>
    </thead>
    <tbody id="missingFeaturedArticlesBody">
    </tbody>
  </table>
  <div class="submitBtnContainer">
     <input type="submit" class="submitToApiBtn" value="Envoyer">
  </div>
  <div id="pagination"></div>

  <div class="messages"></div>

</div>

<script src="<?= trailingslashit(PLUG_DIR) . 'assets/js/AFI_admin.js' ?>" type="module" id="AFI-admin-js"></script>