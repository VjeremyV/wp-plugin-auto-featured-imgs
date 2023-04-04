<?php


wp_enqueue_style('AFI-css-admin', trailingslashit(PLUG_DIR) . 'assets/css/AFI_admin.css', false, '1.0', 'all');
// wp_enqueue_script('AFI-admin-js', trailingslashit(PLUG_DIR) . 'assets/js/AFI_admin.js', [], true);
wp_enqueue_script('AFI-animation-js', trailingslashit(PLUG_DIR) . 'assets/js/AFI_animation.js', [], true);



?>

<div class="wrap">
  <h1>Iron-mage</h1>
  <h2>Clé API</h2>
  <div id="apiKeysContainer">
    <form id="pixabayAPIForm">
      <h3>Pixabay</h3>
      <input type="password" name="pixabayAPI" id="pixabayAPI">
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
  <table id="missingFeaturedArticles">
    <thead id="missingFeaturedArticleThead">
      <tr>
        <th>
          <input type="checkbox" name="selectAll" id="selectAll-1" class='selectAll'>
          <label for="selectAll">Selectionner tous les articles</label>
        </th>
        <th> H1 des articles </th>
        <th><input type="text" name="fullfill" id="fullfill" placeholder="requête commune"></th>
      </tr>
    </thead>
    <thead id="resultImgsThead">
      <tr>
        <th>
          <input type="checkbox" name="selectAll" id="selectAll-2" class='selectAll'>
          <label for="selectAll">Selectionner tous les articles</label>
        </th>
        <th> H1 des articles </th>
        <th>Images trouvées</th>
      </tr>
    </thead>
    <tbody id="missingFeaturedArticlesBody"></tbody>
  </table>
  <div id="messages"></div>
</div>

 <script src="<?= trailingslashit(PLUG_DIR) . 'assets/js/AFI_admin.js'?>" type ="module" id="AFI-admin-js"></script> 