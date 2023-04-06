import { setupCommonRequest, setupSelectAll, checkField, lockFields, updateRequest, unlockFields  } from './AFI_Setup.js'
import { addApiInDb, getImgsUploaded, getmissingImgsArtc, callPixabayApi, getImgsPixabay  } from './AFI_API.js'
import { displayResultsImgs, selectRandom, displayMessage, hideElement, displaytableHeader, displayMissingArticles, displayEndScreen } from './AFI_Display.js'
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
  let missingFeaturedArticleThead = document.getElementById("missingFeaturedArticleThead");
  let resultImgsThead = document.getElementById("resultImgsThead");
  let messagesContainer = document.getElementById("messages");
  let endScreen = document.querySelector('.endScreen');
  let selectedImgs = [];
  ////////////////////////////////////////////ENREGISTREMENT DES CLEFS API/////////////////////////////////////////

  pixabayAPIForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let response = await addApiInDb(pixabayAPIKey.value, "pixabay", optionsPost);
    switch (response) {
      case '"maj"' : 
      displayMessage('La clef API a bien été mise à jour', true, messagesContainer);
      break;
      case '"creation"' : 
      displayMessage('La clef API a bien été mise à jour', true , messagesContainer);
      break;
      case '"fail"' : 
      displayMessage('Un problème est survenu lors de la connexion avec le serveur', false , messagesContainer);
      break;
      default:
        displayMessage('Un problème est survenu lors de la connexion avec le serveur', false , messagesContainer);
    }
    pixabayAPIKey.value = "";
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  formGenerateImgs.addEventListener("submit", async (e) => {
    e.preventDefault();
    endScreen.innerHTML= "";
    let missingFeaturedimg = await getmissingImgsArtc(options); //retourne un tableau contenant les ojets articles
    unlockFields();
    displaytableHeader(missingArtTable, missingFeaturedArticleThead, resultImgsThead);
    displayMissingArticles(missingFeaturedimg);
    setupCommonRequest();
    setupSelectAll();
    let submitToApiBtn = document.getElementById("submitToApiBtn");

    submitToApiBtn.addEventListener("click", async () => {
      if (checkField(missingFeaturedimg)) {
        displayMessage("Recherche envoyée", true, messagesContainer);
        hideElement(submitToApiBtn);
        missingFeaturedimg = updateRequest(missingFeaturedimg);
        missingFeaturedimg = await callPixabayApi(missingFeaturedimg);
        displaytableHeader(missingArtTable, missingFeaturedArticleThead, resultImgsThead, true);
        displayResultsImgs(missingFeaturedimg, selectedImgs);
        let rebootBtns = document.querySelectorAll('.reboot');
        rebootBtns.forEach((btn)=> {
          btn.addEventListener('click', ()=> {
            let article = missingFeaturedimg[btn.getAttribute('id')]
            let linkTag = document.getElementById('link-'+btn.getAttribute('id'))
            let newLink = selectRandom(article.imgsUrls).url
            linkTag.innerHTML = `<img class="resultsImgs" src="${newLink}+'" >`
            article.actualImgsUrls = newLink
          })
        })

        setupSelectAll();
        let imgsValidationBtn = document.getElementById("imgsValidationBtn");
        imgsValidationBtn.addEventListener("click", async () => {
          if (checkField(missingFeaturedimg, true)) {
            hideElement(imgsValidationBtn);
            await getImgsUploaded(missingFeaturedimg, optionsPost);
            displayEndScreen(missingArtTable, endScreen, missingFeaturedimg);
         
            displayMessage("Les images ont bien été importées sur vos articles",true ,messagesContainer);
          } else {
            displayMessage("Vous n'avez pas selectionné d'images", false, messagesContainer);
          }
        });
      } else {
        displayMessage("La requête d'un article selectionné n'a pas été remplie ou aucun artile n'a été selectionné", false,messagesContainer);
      }
    });
  });

})();
