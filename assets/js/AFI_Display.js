export {
  displayResultsImgs,
  selectRandom,
  displayMessage,
  hideElement,
  displaytableHeader,
  displayMissingArticles,
  displayEndScreen,
};

/**
 * renvoie une url d'images aléatoire
 * @param {array} imgs
 * @returns
 */
function selectRandom(imgsUrls) {
  let randomSelector = Math.floor(Math.random() * imgsUrls.length);
  return imgsUrls[randomSelector];
}

/**
 * Affiche les resultats d'images dans le tableau de resultat
 * @param {object} articles
 * @param {array} articles
 */
function displayResultsImgs(articles, usedImgs) {
  let html = articles
    .map((article, index) => {
      let imgurl ="";
      if(article.imgsUrls){
        imgurl = selectRandom(article.imgsUrls, usedImgs);
        article["actualImgsUrls"] = imgurl ? imgurl.url : "";
      }
      return article.imgsUrls
        ? `
  <tr>
    <td><input type="checkbox" name="${article.include}" class="include" id="${
            article.include
          }"></td>
    <td><p>${article.category}</p></td>
    <td><p>${article.post_title}</p></td>
    <td class="anotherRequestContainer"><input type="text" name="${index}" id="${index}" class="anotherRequest" value ="${article["request-text"]}"> <button data-id="${index}" class="anotherRequestBtn">Renvoyer</button></td>
    <td class="tdImgsResults">${
      imgurl 
        ? `<a id="link-${index}" href="${imgurl.url}" target="_blank">  <img class="resultsImgs" src="${imgurl.url}" ></a> `
        : `<a id="link-${index}" >Aucune Image ne correspond à la requête</a>`
    } <span class="reboot dashicons dashicons-image-rotate" id="${index}"></span></td>
  </tr>
  `
        : "";
    })
    .join("");

  html += `   <td></td>  <td></td>    <td></td> <td></td>   <td><input type="submit" class="imgsValidationBtn" value="Valider les images"></td>
    `;
  let tableBody = document.getElementById("missingFeaturedArticlesBody");
  tableBody.innerHTML = html;
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
}

/**
 * affiche un message de validation ou d'erreur
 * @param {string} message
 * @param {boolean} validation
 */
function displayMessage(message, validation, messagesContainers) {
  if (validation) {
    messagesContainers.forEach((messagesContainer) => {
      messagesContainer.innerHTML = `
        <span class="validationMessage">${message}</span>
        `;
    });
  } else {
    messagesContainers.forEach((messagesContainer) => {
      messagesContainer.innerHTML = `
        <span class="errorMessage">${message}</span>
        `;
    });
  }
  setTimeout(() => {
    messagesContainers.forEach((messagesContainer) => {
      messagesContainer.innerHTML = "";
    });
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
function displaytableHeader(
  table,
  firstHeader,
  secondHeader,
  secondTime = false
) {
  let submitBtnContainer = document.querySelector(".submitBtnContainer");
  if (!secondTime) {
    table.style.display = "table";
    firstHeader.style.display = "table-header-group";
    secondHeader.style.display = "none";
    submitBtnContainer.style.display = "flex";
  } else {
    firstHeader.style.display = "none";
    secondHeader.style.display = "table-header-group";
    submitBtnContainer.style.display = "none";
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
  <td><p>${article.category}</p></td>
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
function displayEndScreen(table, endScreenTag, articles) {
  table.style.display = "none";
  let html =
    '<div class="resultContainer"><h3>Nouvelles images mises en avant importées</h3><div class="resultsArticlesContainer">';

  html += articles
    .map((article) => {
      return article["featuredImgId"]
        ? `
      <a target="_blank" href="${article.guid}">
      <img src="${article.actualImgsUrls}">
      <h4>${article.post_title}</h4>
      </a>
      `
        : "";
    })
    .join("");
  html += "</div></div>";
  endScreenTag.innerHTML = html;
}
