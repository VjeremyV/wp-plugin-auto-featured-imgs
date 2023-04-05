export { setupCommonRequest, setupSelectAll, checkField, lockFields, updateRequest }


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

    selectAllBtn.forEach((button) => {
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
    });
  }

  /**
   * Vérifie qu'un article sélectionné ai bien une requête associée
   * @param {object} fields
   * @returns
   */
  function checkField(fields, secondTime = false) {
    let valid = true;
    let emptyFields = 0;
    let secondsFields = 0;

    fields.forEach((field) => {
      let includeBtn = document.getElementById(field.include);
      if (!secondTime) {
        let inputRequest = document.getElementById(field.request);
        if (includeBtn.checked === true && inputRequest.value == "") {
          valid = false;
        }
        if (includeBtn.checked === false) {
          emptyFields++;
        }
      } else {
        if (field["request-text"]) {
          secondsFields++;
          if (includeBtn.checked === false) {
            emptyFields++;
          }
        }
      }
    });

    if (!secondTime) {
      if (emptyFields === fields.length) {
        valid = false;
      }
    } else {
      if (emptyFields === secondsFields) {
        valid = false;
      }
    }
    if (valid) {
      lockFields(fields, secondTime ? secondTime : false);
    }
    return valid;
  }

   /**
   * Bloque l'accès aux champs de saisie
   * @param {object} fields
   */
   function lockFields(fields, secondTime = false) {
    fields.forEach((field) => {
      if (!secondTime) {
        let inputRequest = document.getElementById(field.request);
        inputRequest.disabled = true;
        let otherSelectBtn = document.getElementById(field.include);
        otherSelectBtn.disabled = true;
      } else {
        if(field['request-text']){
          document.getElementById(field.include).disabled = true
        }
      }
    });
    if (!secondTime) {
      let commonRequestInput = document.getElementById("fullfill");
      commonRequestInput.disabled = true;
      let selectAllBtn = document.getElementById("selectAll-1");
      selectAllBtn.disabled = true;
    } else {
      let selectAllBtn = document.getElementById("selectAll-2");
      selectAllBtn.disabled = true;
    }
  }

   /**
   * Met à jour l'objet contenant tous les articles avec les données des articles selectionnés
   * @param {object} articles
   * @returns
   */
   function updateRequest(articles) {
    let count = 0;
    articles.forEach((field) => {
      let check = document.getElementById(field.include);
      if (check.checked === true) {
        let inputRequest = document.getElementById(field.request);
        let value = inputRequest.value.trim();
        let request = value.replaceAll(" ", "-");
        articles[count]["request-text"] = request;
      }
      count++;
    });
    return articles;
  }
