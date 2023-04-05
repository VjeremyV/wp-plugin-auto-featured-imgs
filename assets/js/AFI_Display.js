export { displayResultsImgs, selectRandom, displayMessage, hideElement, displaytableHeader, displayMissingArticles, displayEndScreen}



  /**
   * Affiche les resultats d'images dans le tableau de resultat
   * @param {object} articles
   */
  function displayResultsImgs(articles) {
    let html = articles
      .map((article) => {
        let imgurl = article.imgsUrls ? selectRandom(article.imgsUrls) : "";
        article["actualImgsUrls"] = imgurl;
        article["SeeingImgs"] = 1;
        return article.imgsUrls
          ? `
  <tr>
  <td><input type="checkbox" name="${article.include}" class="include" id="${
              article.include
            }"></td>
  <td><p>${article.post_title}</p></td>
  <td class="tdImgsResults">${
    article.imgsUrls
      ? `<a href="${imgurl}" target="_blank"><img class="resultsImgs" src="${imgurl}+'" ></a> `
      : ""
  } <span class="reboot dashicons dashicons-image-rotate"></span></td>
  </tr>
  `
          : "";
      })
      .join("");

    html += `   <td></td>   <td></td>   <td><input type="submit" id="imgsValidationBtn" value="Valider les images"></td>
    `;
    let tableBody = document.getElementById("missingFeaturedArticlesBody");
    tableBody.innerHTML = html;
  }

  /**
   * renvoie une url d'images aléatoire
   * @param {array} imgs 
   * @returns 
   */
  function selectRandom(imgs) {
    let randomSelector = Math.floor(Math.random() * imgs.length);
    return imgs[randomSelector];
  }

   /**
   * affiche un message de validation ou d'erreur
   * @param {string} message
   * @param {boolean} validation
   */
   function displayMessage(message, validation, messagesContainer) {
    if (validation) {
      messagesContainer.innerHTML = `
      <span class="validationMessage">${message}</span>
      `;
    } else {
      messagesContainer.innerHTML = `
      <span class="errorMessage">${message}</span>
      `;
    }
    setTimeout(() => {
      messagesContainer.innerHTML = "";
    }, 4000);
  }


    /**
   * cache un élément
   * @param {mixed} element
   */
    function hideElement(element) {
        element.style.display = "none";
      }


      /**
       * affiche le header du tableau de resultat et le met à jour en fonction de l'avancement
       * @param {*} table 
       * @param {*} firstHeader 
       * @param {*} secondHeader 
       * @param {*} secondTime 
       */
  function displaytableHeader(table, firstHeader, secondHeader, secondTime = false) {
    if (!secondTime) {
        table.style.display = "table";
        firstHeader.style.display = "table-header-group";
        secondHeader.style.display = "none";
    } else {
        firstHeader.style.display = "none";
      secondHeader.style.display = "table-header-group";
    }
  }

  /**
   *
   * @param {array} articles
   */
  function displayMissingArticles(articles) {
    let html = articles
      .map(
        (article) => `
  <tr>
  <td><input type="checkbox" name="${article.include}" class="include" id="${article.include}"></td>
  <td><p>${article.post_title}</p></td>
  <td><input type="text" name="${article.request}" class="requestInputs" id="${article.request}"></td>
  </tr>
  `
      )
      .join("");
    html += `   <td></td>   <td></td>   <td><input type="submit" id="submitToApiBtn" value="Envoyer"></td>
    `;
    let tableBody = document.getElementById("missingFeaturedArticlesBody");
    tableBody.innerHTML = html;
  }

/**
 * 
 * @param {*} table 
 * @param {*} articles 
 */
  function displayEndScreen(table, endScreenTag, articles){
    table.style.display = 'none';
    let html = '<div class="resultContainer"><h3>Nouvelles images mises en avant importées</h3><div>';
    
    html += articles.map((article) => {
      return article.imgsUrls ? `
      <a target="_blank" href="${article.guid}">
      <img src="${article.actualImgsUrls}">
      <h4>${article.post_title}</h4>
      </a>
      ` : ""
    }).join('');
    html+= '</div></div>'
    endScreenTag.innerHTML = html;
  }

  
  