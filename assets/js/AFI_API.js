export {
  addApiInDb,
  getImgsUploaded,
  getmissingImgsArtc,
  callPixabayApi,
  getImgsPixabay,
  laughtLoader,
  callPixabayApiOneArticle,
};

import { displayMessage } from "./AFI_Display.js";

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
  let count = 1;
  let requestNumber = 0;
  let messagesBox = document.getElementById("loaderMessage");

  for (let article of articles) {
    let checkbox = document.getElementById(article.include);
    if (article["request-text"] && checkbox.checked === true) {
      requestNumber++;
    }
  }
  try {
    for (let article of articles) {
      let checkbox = document.getElementById(article.include);
      if (article["request-text"] && checkbox.checked === true) {
        messagesBox.innerHTML = `<span class="validationMessageLoader">Validation de ${count}/${requestNumber} images</span>`;
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
        count++;
      }
    }
  } catch (err) {
    laughtLoader(false);
    console.log("fetch error : " + err);
    displayMessage(
      "une erreur est survenue lors du téléchargement des images",
      false,
      document.querySelectorAll(".messages")
    );
  }
}

/**
 * Appel à l'API pour recevoir les articles n'ayant pas d'images à la une
 * @returns
 */
async function getmissingImgsArtc(options) {
  try {
    const response = await fetch("/wp-json/AFI/v1/get_missing_articles", {
      ...options,
    });
    const data = await response.json();
    return data;
  } catch (err) {
    laughtLoader(false);
    console.log("fetch error : " + err);
    displayMessage(
      "une erreur est survenue lors de la connexion à l'API rest de wordpress",
      false,
      document.querySelectorAll(".messages")
    );
  }
}

function laughtLoaderMini() {


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
  let messagesBox = document.getElementById("loaderMessage");
  articles.forEach((article) => {
    if (article["request-text"]) {
      requestNumber++;
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
        messagesBox.innerHTML = `<span class="validationMessageLoader">Traitement de ${count}/${requestNumber} images</span>`;
        count++;
      } else {
        articles[index]["imgsUrls"] = false;
      }
    })
  );
  laughtLoader(false);
  return articles;
}

async function callPixabayApiOneArticle(article) {
  let response = await getImgsPixabay(article["request-text"]);
  let temp = [];
  for (let imgsData of response["hits"]) {
    let data = {
      id: imgsData.id,
      url: imgsData.largeImageURL,
    };
    temp.push(data);
  }
  article.imgsUrls = temp;
}
/**
 * Fait la requete à pixabay pour les images manquantes
 * @param {string} request
 */
async function getImgsPixabay(request) {
  try {
    const response = await fetch(
      "/wp-json/AFI/v1/AFI_get_imgs?text=" + request
    );
    const data = await response.json();
    return data;
  } catch (err) {
    laughtLoader(false);
    console.log("fetch error : " + err);
    displayMessage(
      "une erreur est survenue lors de la recherche des images, vérifiez votre clef API",
      false,
      document.querySelectorAll(".messages")
    );
  }
}

function laughtLoader(start = true) {
  let animationContainers = document.getElementById("animationContainer");

  if (start) {
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

    `;
  } else if (!start) {
    animationContainers.innerHTML = "";
  }
}
