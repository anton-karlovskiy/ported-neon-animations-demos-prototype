
const ANIMATION_PLAY_STATE = {
  RUNNING: "running"
};

const IRON_SELECTED = "iron-selected";
const TOGGLE_TYPE = {
  OPEN: "open",
  CLOSE: "close"
};

const tiles = document.getElementsByClassName("tile");
const fixedBackground = document.getElementById("fixed");
const card = document.getElementById("card");
let rippleAnimation;
let heroAnimation;
let fadeOutAnimation;
let transformAnimation;

// TODO: we could achieve this blocking with pointer-events: none;
const checkAnimationsRunning = () => {
  if (rippleAnimation && rippleAnimation.playState === ANIMATION_PLAY_STATE.RUNNING) return true;
  if (heroAnimation && heroAnimation.playState === ANIMATION_PLAY_STATE.RUNNING) return true;
  if (fadeOutAnimation && fadeOutAnimation.playState === ANIMATION_PLAY_STATE.RUNNING) return true;
  if (transformAnimation && transformAnimation.playState === ANIMATION_PLAY_STATE.RUNNING) return true;

  return false;
};

// MEMO: document.getAnimations(); not supported
// MEMO: can be checked by https://css-tricks.com/css-animations-vs-web-animations-api/ and https://codepen.io/danwilson/pen/xGBKVq
const checkAnimationsRunningWithUnsupportedMethod = () => {
  let areAnimationsRunning = false;
  const animations = document.getAnimations();
  for (const animation of animations) {
    if (animation.playState === "running") {
      areAnimationsRunning = true;
      break;
    }
  }

  return areAnimationsRunning;
};

// MEMO: inspired by https://stackoverflow.com/questions/27745438/how-to-compute-getboundingclientrect-without-considering-transforms
const getAdjustedBoundingClientReact = el => {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const tx = style.transform;

  if (tx) {
    let sx, sy, dx, dy;
    if (tx.startsWith("matrix3d(")) {
      const ta = tx.slice(9,-1).split(/, /);
      sx = +ta[0];
      sy = +ta[5];
      dx = +ta[12];
      dy = +ta[13];
    } else if (tx.startsWith("matrix(")) {
      const ta = tx.slice(7,-1).split(/, /);
      sx = +ta[0];
      sy = +ta[3];
      dx = +ta[4];
      dy = +ta[5];
    } else {
      return rect;
    }

    const to = style.transformOrigin;
    const x = rect.x - dx - (1 - sx) * parseFloat(to);
    const y = rect.y - dy - (1 - sy) * parseFloat(to.slice(to.indexOf(" ") + 1));
    const w = sx ? rect.width / sx : el.offsetWidth;
    const h = sy ? rect.height / sy : el.offsetHeight;
    return {
      x: x,
      y: y,
      width: w,
      height: h,
      top: y,
      right: x + w,
      bottom: y + h,
      left: x
    };
  } else {
    return rect;
  }
};

const openFullSizePageWithCard = event => {
  if (checkAnimationsRunning()) return;

  const selectedColor = event.srcElement.dataset.color;
  fixedBackground.className = `${selectedColor}-100`;
  card.className = `${selectedColor}-300`;

  // MEMO: this must be preceded before rippleAnimation(); & runHeroAnimation();
  toggleFullSizePageWithCard(TOGGLE_TYPE.OPEN);

  runRippleAnimation({
    gesture: {
      x: event.x || event.pageX,
      y: event.y || event.pageY
    },
    from: event.target,
    to: fixedBackground
  });
  runHeroAnimation({delay: 150, from: event.target, to: card});
};

const closeFullSizePageWithCard = event => {
  if (checkAnimationsRunning()) return;
  runFadeOutAnimation({node: fixedBackground});

  runTransformAnimation({
    transformFrom: "none",
    transformTo: "translate(0px,-200vh) scale(0.9,1)",
    node: card
  });
};

const toggleFullSizePageWithCard = toggleType => {
  const fullsizePageWithCard = document.querySelector(".fullsize-page-with-card");
  if (toggleType === TOGGLE_TYPE.OPEN) {
    fullsizePageWithCard.classList.add(IRON_SELECTED);
  } else {
    fullsizePageWithCard.classList.remove(IRON_SELECTED);
  }
};

const runRippleAnimation = ({ gesture, from, to }) => {
  let translateX, translateY;
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();
  
  if (gesture) {
    translateX = gesture.x - (toRect.left + (toRect.width / 2));
    translateY = gesture.y - (toRect.top + (toRect.height / 2));
  } else {
    translateX = (fromRect.left + (fromRect.width / 2)) -
      (toRect.left + (toRect.width / 2));
    translateY = (fromRect.top + (fromRect.height / 2)) -
      (toRect.top + (toRect.height / 2));
  }

  const translate = `translate(${translateX}px, ${translateY}px)`;
  const size = Math.max(
    toRect.width + Math.abs(translateX) * 2,
    toRect.height + Math.abs(translateY) * 2);
  const diameter = Math.sqrt(2 * size * size);
  const scaleX = diameter / toRect.width;
  const scaleY = diameter / toRect.height;
  const scale = `scale(${scaleX}, ${scaleY})`;

  const rippleAnimationKeyframes = new KeyframeEffect(
    to, [
      {"transform": `${translate} scale(0)`},
      {"transform": `${translate} ${scale}`}
    ], {
      duration: 500,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      // TODO: the last keyframe's transform persisted probably due to display: none; of fullsizePageWithCard
      // TODO: research into neon-animated-pages more
      // fill: "both"
      // TODO: tweak
      fill: "backwards"
    }
  );

  to.style.transformOrigin = "50% 50%";
  to.style.borderRadius = "50%";

  rippleAnimation = new Animation(rippleAnimationKeyframes, document.timeline);
  rippleAnimation.play();

  rippleAnimation.onfinish = (() => {
    to.style.transformOrigin = "";
    to.style.borderRadius = "";
  });
};

const runHeroAnimation = ({ delay = 0, from, to }) => {
  const fromRect = from.getBoundingClientRect();
  // TODO: this might not be required once we resolve animation-fill-mode--not--working issue
  const toRect = getAdjustedBoundingClientReact(to);

  const deltaLeft = fromRect.left - toRect.left;
  const deltaTop = fromRect.top - toRect.top;
  const deltaWidth = fromRect.width / toRect.width;
  const deltaHeight = fromRect.height / toRect.height;

  const heroAnimationKeyframes = new KeyframeEffect(
    to, [
      {"transform": `translate(${deltaLeft}px, ${deltaTop}px) scale(${deltaWidth}, ${deltaHeight})`},
      {"transform": "none"}
    ], {
      duration: 500,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "both",
      delay
    }
  );

  to.style.transformOrigin = "0 0";
  to.style.zIndex = 10000;
  // MEMO: no need and bad effect of black background behind the tile
  // from.style.visibility = "hidden";

  heroAnimation = new Animation(heroAnimationKeyframes, document.timeline);
  heroAnimation.play();

  heroAnimation.onfinish = (() => {
    to.style.zIndex = "";
    from.style.visibility = "";
  });
};

const runFadeOutAnimation = ({ node }) => {
  const fadeOutAnimationKeyframes = new KeyframeEffect(
    node, [
      {"opacity": "1"},
      {"opacity": "0"}
    ], {
      duration: 500,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      // TODO: the last keyframe's transform (opacity: 0;) persisted probably due to display: none; of fullsizePageWithCard
      // fill: "both"
      // TODO: tweak
      fill: "backwards"
    }
  );

  fadeOutAnimation = new Animation(fadeOutAnimationKeyframes, document.timeline);
  fadeOutAnimation.play();

  fadeOutAnimation.onfinish = (() => {
    // MEMO: could be simpler
    if (!transformAnimation || transformAnimation.playState !== ANIMATION_PLAY_STATE.RUNNING) {
      toggleFullSizePageWithCard(TOGGLE_TYPE.CLOSE);
    }
  });
};

const runTransformAnimation = ({
  transformFrom = "none",
  transformTo = "none",
  node,
  transformOrigin
}) => {
  const transformAnimationKeyframes = new KeyframeEffect(
    node, [
      {"transform": transformFrom},
      {"transform": transformTo}
    ], {
      duration: 500,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "both"
    }
  );

  if (transformOrigin) {
    node.style.transformOrigin = transformOrigin;
  }

  transformAnimation = new Animation(transformAnimationKeyframes, document.timeline);
  transformAnimation.play();

  transformAnimation.onfinish = (() => {
    // MEMO: the same
    if (!fadeOutAnimation || fadeOutAnimation.playState !== ANIMATION_PLAY_STATE.RUNNING) {
      toggleFullSizePageWithCard(TOGGLE_TYPE.CLOSE);
    }
  });
};

for (const tile of tiles) {
  tile.addEventListener("mousedown", openFullSizePageWithCard, false);
}

fixedBackground.addEventListener("mousedown", closeFullSizePageWithCard, false);

window.onunload = function() {
  for (const tile of tiles) {
    tile.removeEventListener("mousedown", openFullSizePageWithCard, false);
  }
  fixedBackground.removeEventListener("mousedown", closeFullSizePageWithCard, false);
}
