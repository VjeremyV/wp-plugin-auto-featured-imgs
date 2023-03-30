<?php
wp_enqueue_style('AFI-css-admin', trailingslashit(PLUG_DIR) . 'assets/css/AFI_admin.css', false, '1.0', 'all');
wp_enqueue_script('AFI-admin-js', trailingslashit(PLUG_DIR) . 'assets/js/AFI_admin.js', [], true);
wp_enqueue_script('AFI-animation-js', trailingslashit(PLUG_DIR) . 'assets/js/AFI_animation.js', [], true);



?>

<div class="wrap">
  <h1>Iron-mage</h1>
  <h2>Clés API</h2>
  <div id="apiKeysContainer">
    <form id="envatoAPIForm">
      <h3>Envato</h3>
      <input type="password" name="envatoAPI" id="envatoAPI">
      <div class="showPwd">
        <input type="checkbox" id="showpwdEnvato">
        <label for="showpwdEnvato">Voir la clé</label>
      </div>
      <input type="submit" value="mettre à jour">

    </form>
    <form id="deeplAPIForm">
      <h3>Deepl</h3>
      <input type="password" name="deeplAPI" id="deeplAPI">
      <div class="showPwd">
        <input type="checkbox" id="showpwddeepl">
        <label for="showpwddeepl">Voir la clé</label>
      </div>
      <input type="submit" value="mettre à jour">
    </form>
  </div>
  <div id="Container">
    <form id="generateImgs" class="container">
      <div class="loader"></div>
      <div class="result_fetch"></div>
      <input type="submit" value="Chercher les articles sans images mises en avant">
    </form>
    <div id="deeplContainer">
      <input type="checkbox" name="goWithDeepl" id="goWithDeepl">
      <label for="goWithDeepl">Traduire avec deepl </label>
    </div>
  </div>
  <table id="missingFeaturedArticles">
    <thead>
      <tr>
        <th>
          <input type="checkbox" name="selectAll" id="selectAll">
          <label for="selectAll">Selectionner tous les articles</label>
        </th>
        <th> H1 des articles </th>
        <th><input type="text" name="fullfill" id="fullfill" placeholder="requête commune"></th>
      </tr>
    </thead>
    <tbody id="missingFeaturedArticlesBody"></tbody>
  </table>
  <div id="messages"></div>
</div>