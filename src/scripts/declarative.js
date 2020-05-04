
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
  if (selectedPageNumber !== pageNumber) return;
  const page = document.getElementById(pageNumber.toString());
  page.classList.remove(IRON_SELECTED);
};

showPage(selectedPageNumber);

const slidePages = event => {
  const arrowButtonId = event.target.id;
  let newSelectedPageNumber;
  let entryNode;
  let entryAnimationMethod;
  let exitAnimationMethod;

  const exitNode = document.getElementById(selectedPageNumber.toString());
  switch (arrowButtonId) {
    case BUTTON_IDS.PREV:
      newSelectedPageNumber = selectedPageNumber === MIN_PAGE_NUMBER ? MAX_PAGE_NUMBER : (selectedPageNumber - 1);
      entryAnimationMethod = runSlideFromLeftAnimation;
      exitAnimationMethod = runSlideRightAnimation;
      break;
    case BUTTON_IDS.NEXT:
      newSelectedPageNumber = selectedPageNumber === MAX_PAGE_NUMBER ? MIN_PAGE_NUMBER : (selectedPageNumber + 1);
      entryAnimationMethod = runSlideFromRightAnimation;
      exitAnimationMethod = runSlideLeftAnimation;
      break;
    case BUTTON_IDS.UP:
      newSelectedPageNumber = selectedPageNumber === MAX_PAGE_NUMBER ? MIN_PAGE_NUMBER : (selectedPageNumber + 1);
      entryAnimationMethod = runSlideFromTopAnimation;
      exitAnimationMethod = runSlideDownAnimation;
      break;
    case BUTTON_IDS.DOWN:
      newSelectedPageNumber = selectedPageNumber === MIN_PAGE_NUMBER ? MAX_PAGE_NUMBER : (selectedPageNumber - 1);
      entryAnimationMethod = runSlideFromBottomAnimation;
      exitAnimationMethod = runSlideUpAnimation;
      break;
    default: break;
  }

  entryNode = document.getElementById(newSelectedPageNumber.toString());
  showPage(newSelectedPageNumber);
  setSelectedPageNumber(newSelectedPageNumber);
  entryAnimationMethod({node: entryNode});
  exitAnimationMethod({
    node: exitNode,
    callback: () => {
      hidePage(exitNode.id);
    }
  });
};

const runSlideFromLeftAnimation = ({ node, transformOrigin, callback }) => {
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

  if (callback) {
    slideFromLeftAnimation.onfinish = callback;
  }
};

const runSlideRightAnimation = ({ node, transformOrigin, callback }) => {
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

  if (callback) {
    slideRightAnimation.onfinish = callback;
  }
};

const runSlideFromRightAnimation = ({ node, transformOrigin, callback }) => {
  const slideFromRightAnimationKeyframes = new KeyframeEffect(
    node, [
      {"transform": "translateX(100%)"},
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

  slideFromRightAnimation = new Animation(slideFromRightAnimationKeyframes, document.timeline);
  slideFromRightAnimation.play();

  if (callback) {
    slideFromRightAnimation.onfinish = callback;
  }
};

const runSlideLeftAnimation = ({ node, transformOrigin, callback }) => {
  const slideLeftAnimationKeyframes = new KeyframeEffect(
    node, [
      {"transform": "none"},
      {"transform": "translateX(-100%)"}
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

  slideLeftAnimation = new Animation(slideLeftAnimationKeyframes, document.timeline);
  slideLeftAnimation.play();

  if (callback) {
    slideLeftAnimation.onfinish = callback;
  }
};

const runSlideFromTopAnimation = ({ node, transformOrigin, callback }) => {
  const slideFromTopAnimationKeyframes = new KeyframeEffect(
    node, [
      {"transform": "translateY(-100%)"},
      {"transform": "translateY(0%)"}
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

  slideFromTopAnimation = new Animation(slideFromTopAnimationKeyframes, document.timeline);
  slideFromTopAnimation.play();

  if (callback) {
    slideFromTopAnimation.onfinish = callback;
  }
};

const runSlideDownAnimation = ({ node, transformOrigin, callback }) => {
  const slideDownAnimationKeyframes = new KeyframeEffect(
    node, [
      {"transform": "translateY(0%)"},
      {"transform": "translateY(100%)"}
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

  slideDownAnimation = new Animation(slideDownAnimationKeyframes, document.timeline);
  slideDownAnimation.play();

  if (callback) {
    slideDownAnimation.onfinish = callback;
  }
};

const runSlideFromBottomAnimation = ({ node, transformOrigin, callback }) => {
  const slideFromBottomAnimationKeyframes = new KeyframeEffect(
    node, [
      {"transform": "translateY(100%)"},
      {"transform": "translateY(0)"}
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

  slideFromBottomAnimation = new Animation(slideFromBottomAnimationKeyframes, document.timeline);
  slideFromBottomAnimation.play();

  if (callback) {
    slideFromBottomAnimation.onfinish = callback;
  }
};

const runSlideUpAnimation = ({ node, transformOrigin, callback }) => {
  const slideUpAnimationKeyframes = new KeyframeEffect(
    node, [
      {"transform": "translate(0)"},
      {"transform": "translateY(-100%)"}
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

  slideUpAnimation = new Animation(slideUpAnimationKeyframes, document.timeline);
  slideUpAnimation.play();

  if (callback) {
    slideUpAnimation.onfinish = callback;
  }
};

for (const arrowButton of arrowButtons) {
  arrowButton.addEventListener("mousedown", slidePages, false);
}

window.onunload = function() {
  for (const arrowButton of arrowButtons) {
    arrowButton.removeEventListener("mousedown", slidePages, false);
  }
}
