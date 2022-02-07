function getTemplateList(uid) {
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
    let listOfCards = body.cards
    constructCardTemplates(listOfCards);
  }).catch(function (err) {
    console.log(err);
  });
}

function constructCardTemplates(cards) {
  // Constructing Bootstarp card view
  //   <div class="card" style="width: 18rem;">
  //   <img class="card-img-top" src=".../100px180/" alt="Card image cap">
  //   <div class="card-body">
  //     <h5 class="card-title">Card title</h5>
  //     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  //     <a href="#" class="btn btn-primary">Go somewhere</a>
  //   </div>
  //  </div>
  let cardContainer = document.querySelector(".card-container");
  for (var i = 0; i < cards.length; i++) {
    let card = cards[i];

    let listItem = document.createElement("div");
    listItem.className = 'card';
  
    if(card.cover) {
      let cardImage = document.createElement("img")
      cardImage.className = 'card-img-top';
      cardImage.src = card.cover;
      listItem.appendChild(cardImage);
    }
    if(card.description) {
      let cardBody= document.createElement("div");
      cardBody.className = 'card-body';
      let cardDesc = document.createElement("p");
      cardDesc.className = 'card-text';
      cardDesc.textContent = card.description;
      cardBody.appendChild(cardDesc);
      listItem.appendChild(cardBody);
    }

    cardContainer.appendChild(listItem);
  }
}