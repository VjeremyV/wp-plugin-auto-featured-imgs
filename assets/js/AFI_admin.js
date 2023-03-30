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
  let envatoAPIForm = document.getElementById("envatoAPIForm");
  let envatoAPIKey = document.getElementById("envatoAPI");
  let deeplAPIKey = document.getElementById("deeplAPI");
  let deeplAPIForm = document.getElementById("deeplAPIForm");
  let missingArtTable = document.getElementById("missingFeaturedArticles");
  let goWithDeeplBtn = document.getElementById("goWithDeepl");
  let messagesContainer = document.getElementById('messages');
  ////////////////////////////////////////////ENREGISTREMENT DES CLEFS API/////////////////////////////////////////

  envatoAPIForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await addApiInDb(envatoAPIKey.value, "envato");
    envatoAPIKey.value = "";
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
        await callEnvatoApi(missingFeaturedimg);
        console.log('test asynchrone')
      } else {
        displayMessage("La requête d'un article selectionné n'a pas été remplie", false)
      };
    });

    // count = 0;
    // for (const value of Object.entries(missingFeaturedimg)){
    //     let articleTitle = value[1].post_title;
    //     const translateArticleTitle = await translate(articleTitle);
    //     missingFeaturedimg[count]["translatedTitle"] = translateArticleTitle['translations'][0]['text']
    //     count++;
    // }
    // count = 0;
    // for (const value of Object.entries(missingFeaturedimg)){
    //     let articleTitle = value[1].translatedTitle;
    //     const imgsUrls = await getImgs(articleTitle);
    //     missingFeaturedimg[count]["img_url"] = imgsUrls
    //     count++;
    // }
    // console.log(missingFeaturedimg);
  });



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
    fields.forEach((field) => {
      let includeBtn = document.getElementById(field.include);
      let inputRequest = document.getElementById(field.request);
      if(goWithDeeplBtn.checked === false && includeBtn.checked === true && inputRequest.value ==""){
        valid = false;
      }
    })
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
    let selectAllBtn = document.getElementById("selectAll");
    commonRequestInput.disabled = true;
    selectAllBtn.disabled = true;
  }
  function displaytableHeader() {
    missingArtTable.style.display = "table";
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
    let selectAllBtn = document.getElementById("selectAll");
    let otherSelectBtn = document.querySelectorAll(".include");
    selectAllBtn.addEventListener("change", () => {
      if (selectAllBtn.checked) {
        otherSelectBtn.forEach((btn) => {
          btn.checked = true;
        });
      } else {
        otherSelectBtn.forEach((btn) => {
          btn.checked = false;
        });
      }
    });
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

  async function translate(text) {
    const response = await fetch("/wp-json/AFI/v1/get_translate?text=" + text, {
      ...options,
    });
    const data = await response.json();
    return data;
  }

  async function getmissingImgsArtc() {
    const response = await fetch("/wp-json/AFI/v1/get_missing_articles", {
      ...options,
    });
    const data = await response.json();
    return data;
  }

  async function callEnvatoApi(articles){
    await articles.forEach(async (article)=> {
      if(article['request-text']){
        let response = await getImgs(article['request-text']);
        console.log(response)
      }
    })
  }
  async function getImgs(term) {
    const response = await fetch("/wp-json/AFI/v1/AFI_get_imgs?text=" + term, {
      ...options,
    });
    const data = await response.json();
    return data;
  }
})();
