var globalUid;
var loader;
function showLoadingIndicator(loader) {
  loader.classList.add("d-flex");
}

function hideLoadingIndicator(loader) {
  loader.classList.remove("d-flex");
}

function listCards(uid) {
  globalUid = uid;
  loader = document.getElementsByClassName("loading-indicator")[0];
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
  // Constructing Bootstarp card view
  //   <div class="card" style="width: 18rem;">
  //   <h3>This is heading 3</h3>
  //   <img class="card-img-top" src=".../100px180/" alt="Card image cap">
  //   <div class="card-body">
  //     <h5 class="card-title">Card title</h5>
            //<hr>
  //     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  //     <a href="#" class="btn btn-primary">Go somewhere</a>
  //   </div>
  //  </div>
  let cardContainer = document.querySelector(".card-container");
  cardContainer.innerHTML="";
  for (var i = 0; i < cards.length; i++) {
    let card = cards[i];
    let listItem = document.createElement("div");
    listItem.className = 'card';

    let category = document.createElement("h6");
    category.className = 'card-title';
    category.textContent = 'CATEGORY';
    let categorySpan = document.createElement("span");
    categorySpan.className='card-category';
    categorySpan.textContent=card.category_name;
    category.appendChild(categorySpan);
    listItem.appendChild(category);

    // <div class="card">
    //   <img src="/examples/images/card-back.jpg" alt="Card Back">
    //   <img src="/examples/images/card-front.jpg" class="img-top" alt="Card Front">
    //  </div>

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
      toggleButton.setAttribute('class','btn btn-info px-0 pb-3 toggle-desc');
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
    button.addEventListener('click',function(){sendCard()});
    listItem.appendChild(button);
    cardContainer.appendChild(listItem);
  }
}

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
  // <div class="form-check dropdown-item">
  //    <input type="checkbox" class="form-check-input" id="dropdownCheck">
  //    <label class="form-check-label" for="dropdownCheck">
  //      Remember me
  //    </label>
  //  </div>
  let dropDownContainer = document.querySelector(".category-dropdown-menu");
  categories.forEach((category)=> {
    let div = document.createElement("div");
    div.classList.add('form-check', 'dropdown-item');
    let input = document.createElement("input");
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', category.id);
    input.onclick=function() {
      let category = input.id;
      loadSpecificCardCategory(category)
    }
    input.classList.add('form-check-input');
    
    div.appendChild(input);
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

function sendCard() {
  var x = document.getElementById("card_container");
  if (x.style.display === "none")
  {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  let button = document.createElement("button");
  button.textContent = 'Use Templates';
  button.addEventListener('click',function(){showTemplates()});
  button.id = 'use_template';
  document.body.appendChild(button);
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
    let listOfTemplates = body.templates
    constructTemplates(listOfTemplates);
  }).catch(function (err) {
    console.log(err);
  });
}

function constructTemplates(listOfTemplates) {
  //  <div class="templates">
  //      <p>Test 1</p>
  //      <button type="button">Click Me!</button>
  //   </div>
  let templates = document.querySelector(".templates_list");
  for (var i = 0; i < listOfTemplates.length; i++) {
    let template = listOfTemplates[i];

    let listItem = document.createElement("div");
    listItem.className = 'templates';
    if(template.name) {
      let templateName = document.createElement("p");
      templateName.textContent = template.name;
      listItem.appendChild(templateName);
    }
    let button = document.createElement("button");
    button.textContent = 'Choose';
    listItem.appendChild(button);
    templates.appendChild(listItem);
  }
  var x = document.getElementById("use_template");
  x.style.display = "none";
}