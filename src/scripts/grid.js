
// ray test touch <
const tiles = document.getElementsByClassName("tile");
const fixedBackground = document.getElementById("fixed");
const card = document.getElementById("card");

const zoomTile = event => {
  const selectedColor = event.srcElement.dataset.color;
  console.log('ray : ***** [zoomTile] event.target.innerText, event.srcElement.dataset.color => ', event.target.innerText, event.srcElement.dataset.color);
  fixedBackground.className = `fixed ${selectedColor}-100`;
  card.className = `card ${selectedColor}-300`;

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
  tile.addEventListener("mousedown", zoomTile, false);
  tile.addEventListener("touchstart", zoomTile, false);
}

// TODO: remove those event listeners
// whiteRabbit.removeEventListener("mousedown", downHeGoes, false);
// whiteRabbit.removeEventListener("touchstart", downHeGoes, false);
// ray test touch >
