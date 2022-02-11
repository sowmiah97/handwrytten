var globalUid;
function getTemplateList(uid) {
  globalUid = uid;
  var options = {
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
  ZFAPPS.request(options).then(function (response) {
    let body = JSON.parse(response.data.body);
    console.log(body);
    let listOfCards = body.cards
    constructCardTemplates(listOfCards);
  }).catch(function (err) {
    console.log(err);
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
  for (var i = 0; i < cards.length; i++) {
    let card = cards[i];

    let hr = document.createElement("hr");

    let listItem = document.createElement("div");
    listItem.className = 'card';

    let category = document.createElement("h6");
    category.className = 'card-title';
    category.textContent = 'CATEGORY : ' + card.category_name;
    listItem.appendChild(category);
    listItem.appendChild(hr);

    let carousel = document.createElement("div");
    carousel.className = 'carousel slide';
    carousel.setAttribute("data-ride", "carousel");

    let carouselInner = document.createElement("div");
    carouselInner.className = 'carousel-inner';

    let carouselItemCover = document.createElement("div");
    carouselItemCover.className = 'carousel-item active';

    let coverImage = document.createElement("img");
    coverImage.className = 'd-block w-100';
    coverImage.src = card.cover;
    carouselItemCover.appendChild(coverImage);

    let carouselItemInsideImage = document.createElement("div");
    carouselItemInsideImage.className = 'carousel-item';

    let insideImage = document.createElement("img");
    insideImage.className = 'd-block w-100';
    insideImage.src = card.inside_image;
    carouselItemInsideImage.appendChild(insideImage);

    carouselInner.appendChild(carouselItemCover);
    carouselInner.appendChild(carouselItemInsideImage);
    carousel.appendChild(carouselInner);


    let carouselPrev = document.createElement("a");
    carouselPrev.className = 'carousel-control-prev';
    carouselPrev.setAttribute("href", "#carouselExampleControls");
    carouselPrev.setAttribute("role", "button");
    carouselPrev.setAttribute("data-slide", "prev");

    let carouselPrevIcon = document.createElement("span");
    carouselPrevIcon.className = 'carousel-control-prev-icon';
    carouselPrevIcon.setAttribute("aria-hidden", "true");
    carouselPrev.appendChild(carouselPrevIcon);

    let spanPrev = document.createElement("span");
    spanPrev.className = 'sr-only';
    carouselPrev.appendChild(spanPrev);
    carousel.appendChild(carouselPrev);

    let carouselNext = document.createElement("a");
    carouselNext.className = 'carousel-control-next';
    carouselNext.setAttribute("href", "#carouselExampleControls");
    carouselNext.setAttribute("role", "button");
    carouselNext.setAttribute("data-slide", "next");

    let carouselNextIcon = document.createElement("span");
    carouselNextIcon.className = 'carousel-control-next-icon';
    carouselNextIcon.setAttribute("aria-hidden", "true");
    carouselNext.appendChild(carouselNextIcon);

    let spanNext = document.createElement("span");
    spanNext.className = 'sr-only';
    carouselNext.appendChild(spanNext);
    carousel.appendChild(carouselNext);

    listItem.appendChild(carousel);

    if(card.description) {
      let cardBody= document.createElement("div");
      cardBody.className = 'card-body';
      let cardDesc = document.createElement("p");
      cardDesc.className = 'card-text';
      cardDesc.textContent = card.description;
      cardBody.appendChild(cardDesc);
      listItem.appendChild(cardBody);
    }

    let button = document.createElement("button");
    //button.className = 'btn btn-primary';
    button.textContent = 'Send';
    button.addEventListener('click',function(){send()});
    listItem.appendChild(button);
    cardContainer.appendChild(listItem);
  }
  }

function send() {
console.log("send called");
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

function showTemplates()
{
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
    console.log(response);
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