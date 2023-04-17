export default class AFI_paginator {
  constructor(data, categories, secondTime = false) {
    this.data = data;
    this.categories = categories;
    this.itemsPerPage = 20;
    this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
    this.totalFilteredArticle = -1;
    this.currentPage = 1; // page actuelle
    this.secondTime = secondTime;
    this.filter = [];
  }

  displayItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    let pageItems = this.data.slice(startIndex, endIndex);
    // 1er affichage des resutats
    if (!this.secondTime && this.filter.length === 0) {
      let categoryHtml = this.categories
        .map(
          (categorie) => `
      <div>
      <label for="${categorie}">${categorie}</label>
      <input type="checkbox" class="filter" id="${categorie}" name="${categorie}"  value="${categorie}" >
      </div>
      `
        )
        .join("");

      let categoriesContainer = document.getElementById("categories");
      categoriesContainer.innerHTML = categoryHtml;
      this.setupCategoryFilter();
    }
    let html;

    //si il n'y a pas de filtre
    if (this.filter.length === 0) {
      this.totalFilteredArticle = -1;
      html = pageItems
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
    }
    //si il y a un filtre
    else if (this.filter.length > 0) {
      let items = [];
      this.totalFilteredArticle = 0;
      this.data.forEach((element) => {
        if (this.filter.indexOf(element.category) != -1) {
          this.totalFilteredArticle++;
          items.push(element);
        }
      });
      pageItems = items.slice(startIndex, endIndex);
      if(pageItems.length == 0){
        this.currentPage = 1 ;
        let newStartIndex = (this.currentPage - 1) * this.itemsPerPage;
        pageItems = items.slice(newStartIndex, endIndex);
      }
      html = pageItems
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
    }
    let tableBody = document.getElementById("missingFeaturedArticlesBody");
    tableBody.innerHTML = html;


    this.setupCommonRequest();
    this.setupSelectAll();
    this.createPaginationLinks();
  }

  createPaginationLinks() {
    const paginationElement = document.getElementById("pagination");
    let linkElements = "";

    if (this.totalFilteredArticle != -1) {
      let totalFilteredPages = Math.ceil(
        this.totalFilteredArticle / this.itemsPerPage
      );
      for (let i = 1; i <= totalFilteredPages; i++) {
        let linkElement = ` <a ${
          i == this.currentPage ? 'class="activePage"' : ""
        } data-page="${i}" class="pagination" href="#">${i}</a> `;
        linkElements += linkElement;
      }
    } else {
      for (let i = 1; i <= this.totalPages; i++) {
        let linkElement = ` <a ${
          i == this.currentPage ? 'class="activePage"' : ""
        } data-page="${i}" class="pagination" href="#">${i}</a> `;
        linkElements += linkElement;
      }
    }
    paginationElement.innerHTML = linkElements;
    // ajouter la fonction displayItems pour l'événement 'click' sur chaque lien de pagination
    let linkElementsTag = document.querySelectorAll(".pagination");
    linkElementsTag.forEach((paginationBtn) => {
      paginationBtn.addEventListener("click", () => {
        this.currentPage = paginationBtn.dataset.page;
      });
      paginationBtn.addEventListener("click", this.displayItems.bind(this));
    });
  }

  /**
   * lorsque l'utilisateur renseigne l'input "requête commune" il remplace tous les autres champs de requete par la valeur de ce champs
   */
  setupCommonRequest() {
    let commonRequestInput = document.getElementById("fullfill");
    commonRequestInput.value = "";
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
  setupSelectAll() {
    let selectAllBtn = document.querySelectorAll(".selectAll");
    selectAllBtn.forEach((btn) => {
      btn.checked = false;
    });
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

  setupCategoryFilter() {
    let categoriesCheckboxes = document.querySelectorAll(".filter");

    categoriesCheckboxes.forEach((catCheckbox) => {
      catCheckbox.addEventListener("change", (e) => {
        if (
          e.target.checked === true &&
          this.filter.indexOf(e.target.value) === -1
        ) {
          this.filter.push(e.target.value);
        } else if (
          e.target.checked === false &&
          this.filter.indexOf(e.target.value) != -1
        ) {
          this.filter.splice(this.filter.indexOf(e.target.value), 1);
        }
        this.displayItems();
      });
    });
  }
}
