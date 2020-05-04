
const BUTTON_IDS = {
  PREV: "prev",
  NEXT: "next",
  UP: "up",
  DOWN: "down"
};

const MAX_PAGE_NUMBER = 5;
const MIN_PAGE_NUMBER = 1;
const IRON_SELECTED = "iron-selected";

const arrowButtons = document.getElementsByClassName("arrow-button");

let slideFromLeftAnimation;
let slideRightAnimation;
let slideFromRightAnimation;
let slideLeftAnimation;
let slideFromTopAnimation;
let slideDownAnimation;
let slideFromBottomAnimation;
let slideUpAnimation;

let selectedPageNumber = 1;
const setSelectedPageNumber = newSelectedPageNumber => {
  selectedPageNumber = newSelectedPageNumber;
};

const showPage = pageNumber => {
  const page = document.getElementById(pageNumber.toString());
  page.classList.add(IRON_SELECTED);
};

const hidePage = pageNumber => {
  const page = document.getElementById(pageNumber.toString());
  page.classList.remove(IRON_SELECTED);
};

showPage(selectedPageNumber);

const slidePages = event => {
  const arrowButtonId = event.target.id;

  switch (arrowButtonId) {
    case BUTTON_IDS.PREV:
      const nodeForSlideRightAnimation = document.getElementById(selectedPageNumber.toString());
      const newSelectedPageNumber = selectedPageNumber === MIN_PAGE_NUMBER ? MAX_PAGE_NUMBER : (selectedPageNumber - 1);
      const nodeForSlideFromLeftAnimation = document.getElementById(newSelectedPageNumber.toString());
      showPage(newSelectedPageNumber);
      setSelectedPageNumber(newSelectedPageNumber);
      runSlideFromLeftAnimation({node: nodeForSlideFromLeftAnimation});
      runSlideRightAnimation({node: nodeForSlideRightAnimation});
      break;
    case BUTTON_IDS.NEXT:
      break;
    case BUTTON_IDS.UP:
      break;
    case BUTTON_IDS.DOWN:
      break;
    default: break;
  }
};

const runSlideFromLeftAnimation = ({ node, transformOrigin }) => {
  const slideFromLeftAnimationKeyframes = new KeyframeEffect(
    node, [
      {"transform": "translateX(-100%)"},
      {"transform": "none"}
    ], {
      duration: 500,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "both"
    }
  );

  if (transformOrigin) {
    node.style.transformOrigin = transformOrigin;
  } else {
    node.style.transformOrigin = "0 50%";
  }

  slideFromLeftAnimation = new Animation(slideFromLeftAnimationKeyframes, document.timeline);
  slideFromLeftAnimation.play();

  slideFromLeftAnimation.onfinish = (() => {
    // TODO: do nothing for now
  });
};

const runSlideRightAnimation = ({ node, transformOrigin }) => {
  const slideRightAnimationKeyframes = new KeyframeEffect(
    node, [
      {"transform": "none"},
      {"transform": "translateX(100%)"}
    ], {
      duration: 500,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "both"
    }
  );

  if (transformOrigin) {
    node.style.transformOrigin = transformOrigin;
  } else {
    node.style.transformOrigin = "0 50%";
  }

  slideRightAnimation = new Animation(slideRightAnimationKeyframes, document.timeline);
  slideRightAnimation.play();

  slideRightAnimation.onfinish = (() => {
    // TODO: hide the page (removing the corresponding class)
    hidePage(node.id);
  });
};

for (const arrowButton of arrowButtons) {
  arrowButton.addEventListener("mousedown", slidePages, false);
}

window.onunload = function() {
  arrowButton.removeEventListener("mousedown", slidePages, false);
}
