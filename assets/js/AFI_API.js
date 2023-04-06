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
      } else {
        articles[index]["imgsUrls"] = false;
      }
    })
  );
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
