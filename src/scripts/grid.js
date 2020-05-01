
const tiles = document.getElementsByClassName("tile");
const fixedBackground = document.getElementById("fixed");
const card = document.getElementById("card");

const openFullSizePageWithCard = event => {
  const selectedColor = event.srcElement.dataset.color;
  console.log('ray : ***** [openFullSizePageWithCard] event.target.innerText, event.srcElement.dataset.color => ', event.target.innerText, event.srcElement.dataset.color);
  fixedBackground.className = `fixed ${selectedColor}-100`;
  card.className = `card ${selectedColor}-300`;

  toggleFullSizePageWithCard();
};

const closeFullSizePageWithCard = event => {
  console.log('ray : ***** [closeFullSizePageWithCard] event => ', event);
  toggleFullSizePageWithCard();
};

const toggleFullSizePageWithCard = () => {
  const fullsizePageWithCard = document.querySelector(".fullsize-page-with-card");
  if (fullsizePageWithCard.style.display === "none") {
    fullsizePageWithCard.style.display = "block";
  } else {
    fullsizePageWithCard.style.display = "none";
  }
};

for (const tile of tiles) {
  tile.addEventListener("mousedown", openFullSizePageWithCard, false);
  tile.addEventListener("touchstart", openFullSizePageWithCard, false);
}

fixedBackground.addEventListener("mousedown", closeFullSizePageWithCard, false);
fixedBackground.addEventListener("touchstart", closeFullSizePageWithCard, false);
card.addEventListener("mousedown", closeFullSizePageWithCard, false);
card.addEventListener("touchstart", closeFullSizePageWithCard, false);

// TODO: remove those event listeners
// fixedBackground.removeEventListener("mousedown", closeFullSizePageWithCard, false);
// fixedBackground.removeEventListener("touchstart", closeFullSizePageWithCard, false);
// card.removeEventListener("mousedown", closeFullSizePageWithCard, false);
// card.removeEventListener("touchstart", closeFullSizePageWithCard, false);
