var globalUid;
var loader;

function listCardCategories(uid) {
  let options = {
    url: 'https://api.handwrytten.com/v1/categories/list',
    method: 'GET',
    connection_link_name: "handwrytten",
    url_query:
    [
      {
        key: 'uid',
        value: uid
      }
    ]
  };
  ZFAPPS.request(options).then(function(response) {
    let body = JSON.parse(response.data.body);
    let {categories} = body;
    listCategoriesInDropdown(categories);
  }).catch(function(err) {
    console.log(err);
  })
}

function listCategoriesInDropdown(categories) {
  let dropDownContainer = document.querySelector(".category-dropdown-menu");
  categories.forEach((category = {})=> {
    let div = document.createElement("div");
    div.classList.add('form-check', 'dropdown-item');
    div.setAttribute('id', category.id);
    div.onclick=function() {
      let dropDownLabel = document.querySelector(".card-category-btn");
      dropDownLabel.textContent=div.innerText;
      let category = div.id;
      loadSpecificCardCategory(category);
    }
    let label = document.createElement("label")
    label.classList.add('form-check-label');
    label.setAttribute('for', category.slug);
    label.textContent=category.name;
    div.appendChild(label);
    dropDownContainer.appendChild(div);
  });
}

function loadSpecificCardCategory(id) {
 
  var options = {
    url: `https://api.handwrytten.com/v1/cards/list?category_id=${id}`,
    method: 'GET',
    connection_link_name: "handwrytten",
    url_query:
    [
      {
        key: 'uid',
        value: globalUid
      }
    ]
  };
  showLoadingIndicator(loader);
  ZFAPPS.request(options).then(function (response) {
    let body = JSON.parse(response.data.body);
    let listOfCards = body.cards
    constructCardTemplates(listOfCards);
  }).catch(function (err) {
    console.log(err);
  }).finally(() => {
    hideLoadingIndicator(loader);
  });
}

function showLoadingIndicator(loader) {
  loader.classList.add("d-flex");
}

function hideLoadingIndicator(loader) {
  loader.classList.remove("d-flex");
}

function listCards(uid) {
  globalUid = uid;
  loader = document.querySelector(".loading-indicator");
  showLoadingIndicator(loader);
  let options = {
    url: 'https://api.handwrytten.com/v1/cards/list',
    method: 'GET',
    connection_link_name: "handwrytten",
    url_query:
    [
      {
        key: 'uid',
        value: uid
      }
    ]
  };
  ZFAPPS.request(options).then(function(response) {
    let body = JSON.parse(response.data.body);
    let listOfCards = body.cards
    constructCardTemplates(listOfCards);
  }).catch(function(err) {
    console.log(err);
  }).finally(() => {
    hideLoadingIndicator(loader);
  });
}

function constructCardTemplates(cards) {
  let cardContainer = document.querySelector(".card-container");
  cardContainer.innerHTML="";
  for (var i = 0; i < cards.length; i++) {
    let card = cards[i];
    let listItem = document.createElement("div");
    listItem.setAttribute('class','card card-grid');

    let category = document.createElement("h6");
    category.className = 'card-title';
    category.textContent = 'CATEGORY';
    let categorySpan = document.createElement("span");
    categorySpan.className='card-category';
    categorySpan.textContent=card.category_name;
    category.appendChild(categorySpan);
    listItem.appendChild(category);

    let imageDisplay = document.createElement("div");
    imageDisplay.className = 'card-image';

    let coverImage = document.createElement("img");
    coverImage.src = card.cover;
    coverImage.className = 'card-img-top';
    imageDisplay.appendChild(coverImage);

    let insideImage = document.createElement("img");
    insideImage.src = card.inside_image;
    insideImage.className = 'card-img-top img-top';
    imageDisplay.appendChild(insideImage);

    listItem.appendChild(imageDisplay);

    let name = document.createElement("h5");
    name.className='card-name';
    name.textContent = card.name;
    listItem.appendChild(name);

    if(card.description) {
      let cardBody= document.createElement("div");
      cardBody.className="text-center";

      let toggleButton= document.createElement("a");
      toggleButton.setAttribute('href', `#card${i}`);
      toggleButton.setAttribute('class','btn section-headers foucus-none px-0 pb-3 toggle-desc');
      toggleButton.setAttribute('data-toggle','collapse');
      toggleButton.textContent = 'SHOW DESCRIPTION';
      cardBody.appendChild(toggleButton);

      let cardDesc = document.createElement("div");
      cardDesc.setAttribute('id', `card${i}`);
      cardDesc.setAttribute('name', `card${i}`);
      cardDesc.className='collapse pb-2';
      cardDesc.textContent=card.description;
      cardBody.appendChild(cardDesc);
      listItem.appendChild(cardBody);
    }

    let price = document.createElement("h5");
    price.className="card-price"
    price.textContent = "$" + card.price;
    listItem.appendChild(price);

    let button = document.createElement("a");
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'SEND';
    button.addEventListener('click',function(){
      sendCard(card.id)
    });
    listItem.appendChild(button);
    cardContainer.appendChild(listItem);
  }
}

function sendCard(cardId) {
  let firstPage = document.getElementById("first-page");
  let secondPage = document.getElementById("second-page")
  if (firstPage.style.display === "none") {
    firstPage.style.display = "block";
  } else {
    firstPage.style.display = "none";
    secondPage.style.display = "block";
  }
  loadCardDetails(cardId);
  loadFonts();
  showTemplates();
}

function loadCardDetails(cardId) {
  var options = {
    url: `https://api.handwrytten.com/v1/cards/view?card_id=${cardId}`,
    method: 'GET',
    connection_link_name: "handwrytten",
    url_query:
    [
      {
        key: 'uid',
        value: globalUid
      }
    ]
  };
  let loader = document.querySelector('.loading-indicator-2');
  showLoadingIndicator(loader);
  ZFAPPS.request(options).then(function (response) {
    let body = JSON.parse(response.data.body);
    let selectedCard = body.card;
    let img = document.getElementById("selected-card-img");
    img.setAttribute('src', selectedCard.cover);
    let category = document.getElementById("selected-card-category");
    category.textContent=selectedCard.category_name;
    let orientation = document.getElementById("selected-card-orientation");
    orientation.textContent=selectedCard.orientation === 'P' ? 'Potrait' : 'Landscape';
    let cardName = document.getElementById("selected-card-name");
    cardName.textContent=selectedCard.name;
    let cardPrice = document.getElementById("selected-card-price");
    cardPrice.textContent=`$${selectedCard.price}`;
    let cardDesc = document.getElementById("selected-card-desc");
    cardDesc.textContent=selectedCard.description;
  }).catch(function (err) {
    console.log(err);
  }).finally(() => {
    hideLoadingIndicator(loader);
    let cardDetailSection = document.querySelector(".card-detail-section");
    cardDetailSection.classList.remove("d-none");
  });
}

function loadFonts() {
  var options = {
    url: 'https://api.handwrytten.com/v1/fonts/list',
    method: 'GET',
    connection_link_name: "handwrytten",
    url_query:
    [
      {
        key: 'uid',
        value: globalUid
      }
    ]
  };
  ZFAPPS.request(options).then(function (response) {
    let body = JSON.parse(response.data.body);
    let fontsArray = body.fonts;
    let dropDownContainer = document.querySelector(".font-preview-dropdown");
    fontsArray.forEach((font)=> {
      let div = document.createElement("div");
      div.classList.add('form-check', 'dropdown-item');
      div.setAttribute('id', font.id);
      div.onclick=function() {
        let dropDownLabel = document.querySelector(".wryting-label");
        dropDownLabel.textContent=font.label;
        loadSpecificFont(font);
      }
      let label = document.createElement("label")
      label.classList.add('form-check-label');
      label.setAttribute('for', font.id);
      label.textContent=font.label;
      div.appendChild(label);
      dropDownContainer.appendChild(div);
    });
  }).catch(function (err) {
    console.log(err);
  });
}
function loadSpecificFont(font) {
  let img = document.querySelector("#selected-font-img");
  img.style.height="240px";
  img.setAttribute('src', font.image);
}

function showTemplates() {
  var options = {
    url: 'https://api.handwrytten.com/v1/templates/list',
    method: 'GET',
    connection_link_name: "handwrytten",
    url_query:
    [
      {
        key: 'uid',
        value: globalUid
      }
    ]
  };
  ZFAPPS.request(options).then(function (response) {
    let body = JSON.parse(response.data.body);
    let listOfTemplates = body.templates;
    listTemplatesInDropdown(listOfTemplates);
  }).catch(function (err) {
    console.log(err);
  });
}

function listTemplatesInDropdown(listOfTemplates) {
  let dropDownContainer = document.querySelector(".template-dropdown-menu");
  dropDownContainer.innerHTML="";
  listOfTemplates.forEach((template)=> {
    let div = document.createElement("div");
    div.classList.add('form-check', 'dropdown-item');
    div.setAttribute('id', template.id);
    div.onclick=function() {
      let templateLabel = document.querySelector(".template-label");
      templateLabel.textContent=template.name;
      setPreview(template);
    }
    let label = document.createElement("label")
    label.classList.add('form-check-label');
    label.setAttribute('for', template.name);
    label.textContent=template.name;
    div.appendChild(label);
    dropDownContainer.appendChild(div);
  });
}

function showTemplateSection() {
  let template_dropdown = document.getElementById('template_dropdown');
  template_dropdown.style.display = "block";
  let nameBox = document.getElementById("template-name");
  nameBox.style.display = "none";
}

function setPreview(template) {
  let previewBox = document.querySelector("#template_preview_box");
  previewBox.value = template.message;
  let button = document.getElementById("choose-btn");
  button.onclick=function() {
    populateMsg(template);
  }
}

function populateMsg(template) {
  let msgBox = document.querySelector(".message-preview-box");
  msgBox.value = template.message;
}

function cancelTemplate() {
  let previewBox = document.querySelector("#template_preview_box");
  previewBox.value = '';
  let template_dropdown = document.getElementById('template_dropdown');
  template_dropdown.style.display = "none";
}
function createNewTemplate() {
  let nameBox = document.getElementById("template-name");
  nameBox.style.display = "block";
  let template_dropdown = document.getElementById('template_dropdown');
  template_dropdown.style.display = "none";
  let button = document.getElementById("save-btn");
  button.style.display = "block";
}

function saveNewTemplate() {
  let name = document.getElementById('name-box');
  let message = document.getElementById('template_preview_box');
  var options = {
    url: 'https://api.handwrytten.com/v1/templates/create',
    method: 'POST',
    connection_link_name: "handwrytten",
    url_query: [
      {
        key: 'uid',
        value: globalUid
      },
      {
        key: 'name',
        value: name.value
      },
      {
        key: 'message',
        value: message.value
      }
    ]
  };
  ZFAPPS.request(options).then(function() {
    let nameBox = document.getElementById("template-name");
    nameBox.style.display = "none";
    let template_dropdown = document.getElementById('template_dropdown');
    template_dropdown.style.display = "block";
    showTemplates();
  }).catch(function (err) {
    console.log(err);
  });
}