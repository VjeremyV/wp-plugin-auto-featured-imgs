export { checkField, lockFields, updateRequest, unlockFields, setupCategories, checkImgsSelected };

function checkField(fields, secondTime = false) {
  let valid = true;
  let checkFields = 0;

  fields.forEach((field) => {
    let includeBtn = document.getElementById(field.include);
    if (includeBtn != null) {
        let inputRequest = document.getElementById(field.request);
        if (includeBtn.checked === true) {
          checkFields++;
          if (inputRequest.value === "") {
            valid = false;
          } 
        } 
      } 
  });
  if(checkFields < 1){
    valid = false;
  }

  if (valid) {
    lockFields(fields, secondTime ? secondTime : false);
  }
  return valid;
}

function checkImgsSelected(fields){
  let checkFields = 0;
  fields.forEach((field)=> {
    let includeBtn = document.getElementById(field.include);
    if (includeBtn != null && includeBtn.checked === true) {
      checkFields++;
    }
  })
  if(checkFields === 0 ){
    return false
  }
  return true
}
/**
 * Bloque l'accès aux champs de saisie
 * @param {object} fields
 */
function lockFields(fields, secondTime = false) {
  fields.forEach((field) => {
    let inputRequest = document.getElementById(field.request);
    if (!secondTime && inputRequest != null) {
      inputRequest.disabled = true;
      let otherSelectBtn = document.getElementById(field.include);
      otherSelectBtn.disabled = true;
    } else {
      if (field["request-text"]) {
        document.getElementById(field.include).disabled = true;
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

function unlockFields() {
  let selectAllBTN = document.getElementById("selectAll-1");
  let commonRequestInput = document.getElementById("fullfill");
  commonRequestInput.disabled = false;
  commonRequestInput.value = "";
  selectAllBTN.disabled = false;
  selectAllBTN.checked = false;
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
    if (check != null) {
      if (check.checked === true) {
        let inputRequest = document.getElementById(field.request);
        let value = inputRequest.value.trim();
        let request = value.replaceAll(" ", "-");
        articles[count]["request-text"] = request;
      }
    }
    count++;
  });
  return articles;
}

function setupCategories(articles) {
  let result = [];
  articles.forEach((article) => {
    if (result.indexOf(article.category) === -1) {
      result.push(article.category);
    }
  });

  return result;
}
