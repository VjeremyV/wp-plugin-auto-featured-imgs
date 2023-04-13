export {
  addApiInDb,
  getImgsUploaded,
  getmissingImgsArtc,
  callPixabayApi,
  getImgsPixabay,
};

async function addApiInDb(apiKey, apiName, optionsPost) {
  let response = await fetch("/wp-json/AFI/v1/add_API", {
    ...optionsPost,
    body: JSON.stringify({ service: apiName, clef: apiKey }),
  });
  let data = await response.text();
  return data;
}

/**
 * Appelle la route pour le telechargemetn des images
 * @param {object} articles
 */
async function getImgsUploaded(articles, optionsPost) {
  for (let article of articles) {
    let checkbox = document.getElementById(article.include);
    if (article["request-text"] && checkbox.checked === true) {
      let response = await fetch("/wp-json/AFI/v1/save_file", {
        ...optionsPost,
        body: JSON.stringify({
          url: article.actualImgsUrls,
          title: article.post_title.replaceAll(" ", "-"),
          post_id: article["ID"],
        }),
      });
      let data = await response.json();
      article["featuredImgId"] = data;
    }
  }
}

/**
 * Appel à l'API pour recevoir les articles n'ayant pas d'images à la une
 * @returns
 */
async function getmissingImgsArtc(options) {
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
async function callPixabayApi(articles) {
  let requestNumber = 0;
  let count = 1;
  laughtLoader(true);
  let messagesBox = document.getElementById('loaderMessage');
  articles.forEach(article => {
    if (article["request-text"]){
      requestNumber++
    }
  });
  const allResponses = await Promise.all(
    articles.map(async (article, index) => {
      if (article["request-text"]) {
        let response = await getImgsPixabay(article["request-text"]);
        let temp = [];
        for (let imgsData of response["hits"]) {
          let data = {
            id: imgsData.id,
            url: imgsData.largeImageURL,
          };
          temp.push(data);
        }
        articles[index]["imgsUrls"] = temp;
        messagesBox.innerHTML =  `<span class="validationMessageLoader">Traitement de ${count}/${requestNumber} images</span>`
        count++;
      } else {
        articles[index]["imgsUrls"] = false;
      }
    })
  );
  laughtLoader(false);
  return articles;
}

/**
 * Fait la requete à pixabay pour les images manquantes
 * @param {string} request
 */
async function getImgsPixabay(request) {
  const response = await fetch("/wp-json/AFI/v1/AFI_get_imgs?text=" + request);
  const data = await response.json();
  return data;
}


function laughtLoader(start){
  let animationContainers = document.getElementById('animationContainer')

  if(start){

    animationContainers.innerHTML = `
      <div class='loadd'>
      <div class='body'>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <div class='base'>
              <span></span>
              <div class='face'></div>
          </div>
      </div>
      <div class='longfazers'>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
      </div>
      <div id="loaderMessage"></div>
      </div>

    `
    
  } else if (!start){
  
      animationContainers.innerHTML = ''
    
  }
}