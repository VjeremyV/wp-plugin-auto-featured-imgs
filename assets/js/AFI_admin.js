(() => {
  let options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let optionsPost = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let formGenerateImgs = document.getElementById("generateImgs");
  let pixabayAPIForm = document.getElementById("pixabayAPIForm");
  let pixabayAPIKey = document.getElementById("pixabayAPI");
  let deeplAPIKey = document.getElementById("deeplAPI");
  let deeplAPIForm = document.getElementById("deeplAPIForm");
  let missingArtTable = document.getElementById("missingFeaturedArticles");
  let missingFeaturedArticleThead = document.getElementById('missingFeaturedArticleThead');
  let resultImgsThead = document.getElementById("resultImgsThead");
  let goWithDeeplBtn = document.getElementById("goWithDeepl");
  let messagesContainer = document.getElementById('messages');

  ////////////////////////////////////////////ENREGISTREMENT DES CLEFS API/////////////////////////////////////////

  pixabayAPIForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await addApiInDb(pixabayAPIKey.value, "pixabay");
    pixabayAPIKey.value = "";
  });
  deeplAPIForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await addApiInDb(deeplAPIKey.value, "deepl");
    deeplAPIKey.value = "";
  });

  async function addApiInDb(apiKey, apiName) {
    await fetch("/wp-json/AFI/v1/add_API", {
      ...optionsPost,
      body: JSON.stringify({ service: apiName, clef: apiKey }),
    })
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        console.log(data);
      });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  formGenerateImgs.addEventListener("submit", async (e) => {

    e.preventDefault();
    let missingFeaturedimg = await getmissingImgsArtc(); //retourne un tableau contenant les ojets articles
    displaytableHeader();
    displayMissingArticles(missingFeaturedimg);
    setupCommonRequest();
    setupSelectAll();

    let submitToApiBtn = document.getElementById("submitToApiBtn");

    submitToApiBtn.addEventListener("click", async () => {
      if(checkField(missingFeaturedimg)){
        displayMessage("Recherche envoyée", true)
        hideElement(submitToApiBtn);
        missingFeaturedimg = updateRequest(missingFeaturedimg);
        missingFeaturedimg = await callPixabayApi(missingFeaturedimg);
        displaytableHeader(true);
        displayResultsImgs(missingFeaturedimg);
        setupSelectAll();
        console.log(missingFeaturedimg)

      } else {
        displayMessage("La requête d'un article selectionné n'a pas été remplie ou aucun artile n'a été selectionné", false)
      };
    });
  });

/**
 * Affiche les resultats d'images dans le tableau de resultat
 * @param {object} articles 
 */
  function displayResultsImgs(articles){
    let html = articles
      .map(
        (article) => {
          
          let imgurl = article.imgsUrls ? selectRandom(article.imgsUrls) : "";
          article['actualImgsUrls'] = imgurl;
          article['SeeingImgs'] = 1;
          return   article.imgsUrls ? `
  <tr>
  <td><input type="checkbox" name="${article.include}" class="include" id="${article.include}"></td>
  <td><p>${article.post_title}</p></td>
  <td class="tdImgsResults">${article.imgsUrls ? `<a href="${imgurl}" target="_blank"><img class="resultsImgs" src="${imgurl}+'" ></a> `: ""} <span class="reboot dashicons dashicons-image-rotate"></span></td>
  </tr>
  ` : ''
}).join("");

    html += `   <td></td>   <td></td>   <td><input type="submit" id="submitToApiBtn" value="Valider les images"></td>
    `;
    let tableBody = document.getElementById("missingFeaturedArticlesBody");
    tableBody.innerHTML = html;
  }

  function selectRandom(imgs){
    let randomSelector = Math.floor(Math.random() * imgs.length);
    return imgs[randomSelector];
  }

/**
 * Met à jour l'objet contenant tous les articles avec les données des articles selectionnés
 * @param {object} articles 
 * @returns 
 */
  function updateRequest(articles){
    count = 0;
    articles.forEach((field) => {
      let check = document.getElementById(field.include);
      if(check.checked ===true){
        let inputRequest = document.getElementById(field.request);
        let value = inputRequest.value.trim();
        let request = value.replaceAll(' ', '-')
        articles[count]['request-text'] = request;
      }
      count++;
    })
    return articles;
  }

  /**
   * affiche un message de validation ou d'erreur
   * @param {string} message 
   * @param {boolean} validation 
   */
  function displayMessage(message, validation){
    if(validation){
      messagesContainer.innerHTML = `
      <span class="validationMessage">${message}</span>
      `
    } else {
      messagesContainer.innerHTML = `
      <span class="errorMessage">${message}</span>
      `
    }
    setTimeout(() => {
      messagesContainer.innerHTML = '';
    }, 4000);
  }

/**
 * cache un élément
 * @param {} element 
 */
  function hideElement(element){
    element.style.display = 'none';
  }

  /**
   * Vérifie qu'un article sélectionné ai bien une requête associée
   * @param {object} fields 
   * @returns 
   */
  function checkField(fields) {
    let valid = true;
    let emptyFields = 0;

    fields.forEach((field) => {
      let includeBtn = document.getElementById(field.include);
      let inputRequest = document.getElementById(field.request);

      if(includeBtn.checked === false){
        emptyFields++;
      }

      if(goWithDeeplBtn.checked === false && includeBtn.checked === true && inputRequest.value ==""){
        valid = false;
      }
    })
    if(emptyFields === fields.length){
      valid = false;
    }
    if(valid){
      lockFields(fields);
    }
    return valid
  }

  /**
   * Bloque l'accès aux champs de saisie
   * @param {object} fields 
   */
  function lockFields(fields){
    fields.forEach((field)=> {
      let inputRequest = document.getElementById(field.request);
      let otherSelectBtn = document.getElementById(field.include);
      inputRequest.disabled = true;
      otherSelectBtn.disabled = true;
    })
    let commonRequestInput = document.getElementById('fullfill');
    let selectAllBtn = document.getElementById("selectAll-1");
    commonRequestInput.disabled = true;
    selectAllBtn.disabled = true;
  }
  function displaytableHeader(secondTime = false) {
    if(!secondTime){
      missingArtTable.style.display = 'table';
      missingFeaturedArticleThead.style.display = "table-header-group";
      resultImgsThead.style.display = "none";
    } else {
      missingFeaturedArticleThead.style.display = "none";
      resultImgsThead.style.display = "table-header-group";

    }
  }

  /**
   * lorsque l'utilisateur renseigne l'input "requête commune" il remplace tous les autres champs de requete par la valeur de ce champs
   */
  function setupCommonRequest() {
    let commonRequestInput = document.getElementById("fullfill");
    let othersRequestInput = document.querySelectorAll(".requestInputs");
    commonRequestInput.addEventListener("input", (e) => {
      othersRequestInput.forEach((input) => {
        input.value = e.target.value;
      });
    });
  }

  /**
   * lorsque l'utilisateur clique sur la checkbox "Selectionner tous les articles" il remplace toutes les autres valeurs des boutons select par celle de ce bouton
   */
  function setupSelectAll() {
    let selectAllBtn = document.querySelectorAll(".selectAll");
    let otherSelectBtn = document.querySelectorAll(".include");
    
    selectAllBtn.forEach((button)=> {
      button.addEventListener("change", () => {
        if (button.checked) {
          otherSelectBtn.forEach((btn) => {
            btn.checked = true;
          });
        } else {
          otherSelectBtn.forEach((btn) => {
            btn.checked = false;
          });
        }
      });
    })
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
   * Fais l'appel à l'API deepl pour la traduction
   * @param {string} text 
   * @returns 
   */
  async function translate(text) {
    const response = await fetch("/wp-json/AFI/v1/get_translate?text=" + text, {
      ...options,
    });
    const data = await response.json();
    return data;
  }

  /**
   * Appel à l'API pour recevoir les articles n'ayant pas d'images à la une
   * @returns 
   */
  async function getmissingImgsArtc() {
    const response = await fetch("/wp-json/AFI/v1/get_missing_articles", {
      ...options,
    });
    const data = await response.json();
    return data;
  }

  /**
   * demande l'appel à l'API pour la requete d'images et trie les données dans le tableau contenant tous les objet articles
   * @param {object} articles 
   * @returns 
   */
  async function callPixabayApi(articles){
    const allResponses = await Promise.all(articles.map(async (article, index) => {
      if (article['request-text'])
      {
        let response = await getImgsPixabay(article['request-text']);
      
        let temp = [];
        for(let imgsData of response['hits']){
          temp.push(imgsData.largeImageURL)
        }
        articles[index]['imgsUrls'] = temp;
      }
    }));
    return articles;
  }


/**
 * Fait la requete à pixabay pour les images manquantes
 * @param {string} request 
 */
async function getImgsPixabay(request){
  const response = await fetch('/wp-json/AFI/v1/AFI_get_imgs?text='+request);
  const data = await response.json();
  return data;
}

})();
