import {
  checkField,
  lockFields,
  updateRequest,
  unlockFields,
  setupCategories,
  checkImgsSelected,
} from "./AFI_Setup.js";
import {
  addApiInDb,
  getImgsUploaded,
  getmissingImgsArtc,
  callPixabayApi,
  laughtLoader,
  callPixabayApiOneArticle,
} from "./AFI_API.js";
import {
  displayResultsImgs,
  selectRandom,
  displayMessage,
  hideElement,
  displaytableHeader,
  displayEndScreen,
} from "./AFI_Display.js";
import AFI_paginator from "./AFI_paginator.js";
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
  let missingArtTable = document.getElementById("missingFeaturedArticles");
  let missingFeaturedArticleThead = document.getElementById(
    "missingFeaturedArticleThead"
  );
  let resultImgsThead = document.getElementById("resultImgsThead");
  let messagesContainer = document.querySelectorAll(".messages");
  let endScreen = document.querySelector(".endScreen");
  let selectedImgs = [];
  let categories;
  let missingFeaturedimg;
  let submitToApiBtn = document.querySelectorAll(".submitToApiBtn");
  let firstTime = true;
  let upMessage = document.getElementById("upMessage");
  ////////////////////////////////////////////ENREGISTREMENT DES CLEFS API/////////////////////////////////////////

  pixabayAPIForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let response = await addApiInDb(
      pixabayAPIKey.value,
      "pixabay",
      optionsPost
    );
    switch (response) {
      case '"maj"':
        displayMessage(
          "La clef API a bien été mise à jour",
          true,
          messagesContainer
        );
        break;
      case '"creation"':
        displayMessage(
          "La clef API a bien été mise à jour",
          true,
          messagesContainer
        );
        break;
      case '"fail"':
        displayMessage(
          "Un problème est survenu lors de la connexion avec le serveur",
          false,
          messagesContainer
        );
        break;
      default:
        displayMessage(
          "Un problème est survenu lors de la connexion avec le serveur",
          false,
          messagesContainer
        );
    }
    pixabayAPIKey.value = "";
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  formGenerateImgs.addEventListener("submit", async (e) => {
    e.preventDefault();

    endScreen.innerHTML = "";
    missingFeaturedimg = await getmissingImgsArtc(options); //retourne un tableau contenant les ojets articles
    unlockFields();
    displaytableHeader(
      missingArtTable,
      missingFeaturedArticleThead,
      resultImgsThead
    );
    categories = setupCategories(missingFeaturedimg);
    const paginator = new AFI_paginator(missingFeaturedimg, categories);
    paginator.displayItems();

    if (firstTime) {
      submitToApiBtn.forEach((btn) => {
        btn.style.display = "inline-block";
        btn.addEventListener("click", async () => {
          if (checkField(missingFeaturedimg)) {
            displayMessage("Recherche envoyée", true, messagesContainer);
            hideElement(btn);
            missingFeaturedimg = updateRequest(missingFeaturedimg);
            missingFeaturedimg = await callPixabayApi(missingFeaturedimg);
            displaytableHeader(
              missingArtTable,
              missingFeaturedArticleThead,
              resultImgsThead,
              true
            );
            selectedImgs = [];
            displayResultsImgs(missingFeaturedimg, selectedImgs);
            let rebootBtns = document.querySelectorAll(".reboot");
            rebootBtns.forEach((btn) => {
              btn.addEventListener("click", () => {
                let article = missingFeaturedimg[btn.getAttribute("id")];
                let linkTag = document.getElementById(
                  "link-" + btn.getAttribute("id")
                );
                let newLink = selectRandom(article.imgsUrls).url;
                linkTag.href = newLink;
                linkTag.innerHTML = `<img class="resultsImgs" src="${newLink}+'" >`;
                article.actualImgsUrls = newLink;
              });
            });
            let anotherRequestBtn =
              document.querySelectorAll(".anotherRequestBtn");
            anotherRequestBtn.forEach((btn) => {
              btn.addEventListener("click", async () => {
                let linkTag = document.getElementById("link-" + btn.dataset.id);
                linkTag.innerHTML = `
              <div class="showbox">
                <div class="loader">
                  <svg class="circular" viewBox="25 25 50 50">
                    <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
                  </svg>
                </div>
              </div>
              `;

                let currentArticle = missingFeaturedimg[btn.dataset.id];
                let input = document.getElementById(btn.dataset.id);
                currentArticle["request-text"] = input.value;
                await callPixabayApiOneArticle(currentArticle);
                let newImg = selectRandom(currentArticle.imgsUrls);
                let newLink = newImg? newImg.url : "";
                linkTag.href = newLink;
                linkTag.innerHTML = newLink != "" ? `<img class="resultsImgs" src="${newLink}+'" >` : `<a id="link-${btn.dataset.id}" >Aucune Image ne correspond à la requête</a>`;
                currentArticle.actualImgsUrls = newLink;
              });
            });
            paginator.setupSelectAll();
            let imgsValidationBtn =
              document.querySelectorAll(".imgsValidationBtn");
            imgsValidationBtn.forEach((button) => {
              button.addEventListener("click", async () => {
                if (checkImgsSelected(missingFeaturedimg)) {
                  laughtLoader();
                  hideElement(button);
                  await getImgsUploaded(missingFeaturedimg, optionsPost);
                  displayEndScreen(missingArtTable, endScreen, missingFeaturedimg);
                  displayMessage(
                    "Les images ont bien été importées sur vos articles",
                    true,
                    messagesContainer
                  );
                  laughtLoader(false);
                } else {
                  displayMessage(
                    "Vous n'avez pas selectionné d'image",
                    false,
                    messagesContainer
                  );
                }
              });
            });
          } else {
            displayMessage(
              "La requête d'un article selectionné n'a pas été remplie ou aucun artile n'a été selectionné",
              false,
              messagesContainer
            );
          }
        });
      });
      firstTime = false;
    } else {
      submitToApiBtn.forEach((btn) => {
        btn.style.display = "inline-block";
      });
    }
  });
})();
