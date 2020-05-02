
const tiles = document.getElementsByClassName("tile");
const fixedBackground = document.getElementById("fixed");
const card = document.getElementById("card");

// MEMO: inspired by https://stackoverflow.com/questions/27745438/how-to-compute-getboundingclientrect-without-considering-transforms
const getAdjustedBoundingClientReact = el => {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const tx = style.transform;

  if (tx) {
    let sx, sy, dx, dy;
    if (tx.startsWith('matrix3d(')) {
      const ta = tx.slice(9,-1).split(/, /);
      sx = +ta[0];
      sy = +ta[5];
      dx = +ta[12];
      dy = +ta[13];
    } else if (tx.startsWith('matrix(')) {
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
    const y = rect.y - dy - (1 - sy) * parseFloat(to.slice(to.indexOf(' ') + 1));
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
  const selectedColor = event.srcElement.dataset.color;
  fixedBackground.className = `fixed ${selectedColor}-100`;
  card.className = `card ${selectedColor}-300`;

  toggleFullSizePageWithCard();

  // MEMO: ripple animation
  const gesture = {
    x: event.x || event.pageX,
    y: event.y || event.pageY
  };
  const from = event.target;
  const to = fixedBackground;
  rippleAnimation({gesture, from, to});
};

const closeFullSizePageWithCard = event => {
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

// ray test touch <
const rippleAnimation = ({ gesture, from, to }) => {
  let translateX, translateY;
  const toRect = getAdjustedBoundingClientReact(to);
  const fromRect = from.getBoundingClientRect();
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
    to,
    [
      {'transform': `${translate} scale(0)`},
      {'transform': `${translate} ${scale}`}
    ],
    {
      duration: 500,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "both"
    }
  );

  to.style.transformOrigin = '50% 50%';
  to.style.borderRadius = '50%';

  const rippleAnimation = new Animation(rippleAnimationKeyframes, document.timeline);
  rippleAnimation.play();
};

const heroAnimation = () => {

};
// ray test touch >

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
