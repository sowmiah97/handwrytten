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
    category.setAttribute('style','font-size: 16px; font-family: brandon_grotesquebold;');
    category.textContent = 'Category : ' + card.category_name;
    listItem.appendChild(category);

//    <div class="card">
//        	<img src="/examples/images/card-back.jpg" alt="Card Back">
//            <img src="/examples/images/card-front.jpg" class="img-top" alt="Card Front">
//        </div>

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
    name.textContent = card.name;
    name.setAttribute('style','font-size: 16px; font-family: brandon_grotesquebold; border-bottom: 1px solid #DDDDD6;');
    listItem.appendChild(name);

    if(card.description) {
      let cardBody= document.createElement("div");
      cardBody.className = 'card-body';

      let toggleButton= document.createElement("button");
      toggleButton.setAttribute('type','button');
      toggleButton.setAttribute('class','btn btn-info');
      toggleButton.setAttribute('style','background-color:transparent;color:black; outline:none; border:none;')
      toggleButton.setAttribute('data-toggle','collapse');
      toggleButton.setAttribute('data-target', '#' + card.id);
      toggleButton.textContent = 'Show Description'
      cardBody.appendChild(toggleButton);

      let cardDesc = document.createElement("div");
      cardDesc.className = 'collapse';
      cardDesc.id = card.id;
      cardDesc.textContent = card.description;
      cardBody.appendChild(cardDesc);
      listItem.appendChild(cardBody);
    }

    let price = document.createElement("h5");
    price.textContent = "$" + card.price;
    price.setAttribute('style','font-size: 20px; font-family: brandon_grotesquebold; border-bottom: 1px solid #DDDDD6; border-up: 1px solid #DDDDD6;');

    listItem.appendChild(price);

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