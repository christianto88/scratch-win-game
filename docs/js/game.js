var timeout = null;
var images = [];
var chosenIndex = [];
var failedCount = 0;
var scratch1, scratch2, scratch3;
var ctx1, ctx2, ctx3;
var selectedBoxId;
attachEventListener = function (c, ctx) {
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, 300, 300);
  c.addEventListener("mousedown", function () {
    if (timeout) {
      clearTimeout(timeout);
    }

    c.addEventListener("mousemove", deleteArea);

    c.addEventListener("mouseup", function () {
      c.removeEventListener("mousemove", deleteArea);
      let percentage = fillPercentage(this.id);
      if (percentage > 30) {
        ctx.clearRect(0, 0, 300, 300);
        if (selectedBoxId === this.id) {
          document.getElementById("revealPrize").style.display = "initial";
          document.getElementById("gameText").innerText =
            "wow congratulations and you are the lucky winner";
          //   setTimeout(() => {
          //     window.location.href = "prizes.html";
          //   }, 2000);
        }
      }
    });
  });
};

function deleteArea(props) {
  const { layerX, layerY, target } = props;
  let ctx;
  if (target.id === "scratch-1") {
    ctx = ctx1;
  } else if (target.id === "scratch-2") {
    ctx = ctx2;
  } else if (target.id === "scratch-3") {
    ctx = ctx3;
  }
  ctx.arc(layerX, layerY, 15, 0, 2 * Math.PI);
  ctx.save();
  ctx.clip();
  ctx.clearRect(layerX - 15, layerY - 15, 30, 30);
  ctx.restore();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function setChance(percentage, imageUrl) {
  for (let i = 0; i < percentage; i++) {
    images.push(imageUrl);
  }
}

// function saveEmail() {
//     let email = document.getElementById("input-email").value;
//     sessionStorage.setItem("scratch-games-email", email);

//     let inputEmailContainer = document.getElementById("input-email-container");
//     inputEmailContainer.style.display = "none";

//     let scratchCard = document.getElementById("scratch-card");
//     scratchCard.style.display = "block";
// }

function fillPercentage(id) {
  let ctx = "";
  if (id === "scratch-1") {
    ctx = ctx1;
  } else if (id === "scratch-2") {
    ctx = ctx2;
  } else if (id === "scratch-3") {
    ctx = ctx3;
  }
  const data = ctx.getImageData(0, 0, 150, 150).data;

  // The total number of pixels is the length of the
  // data array divided by 4, or width * height
  const nrOfPixels = data.length / 4; // rgba pixels
  let transparent = 0;

  // Your code removes the alpha, so we check each
  // 4th item in the array (notice the += 4)
  // If it's transparent (A === 0), we count it
  for (let i = 3; i < data.length; i += 4) {
    transparent += data[i] ? 0 : 1;
  }

  // The percentage is the number of transparent pixels
  // divided by the total number of pixels
  const percentage = (transparent / nrOfPixels) * 100;
  return percentage;
}

function setBackgroundImages() {
  let boxNumber = getRandomInt(3) + 1;
  selectedBoxId = `scratch-${boxNumber}`;
  document.getElementById(
    `scratch-img-${boxNumber}`
  ).src = `${images[chosenIndex]}`;
}
document.body.onload = function () {
  //   var c = document.getElementById("myCanvas");
  //   var ctx = c.getContext("2d");
  //   ctx.fillStyle = "#92B901";
  //   ctx.fillRect(0, 0, 300, 300);
  scratch1 = document.getElementById(`scratch-1`);
  ctx1 = scratch1.getContext("2d");
  scratch2 = document.getElementById(`scratch-2`);
  ctx2 = scratch2.getContext("2d");
  scratch3 = document.getElementById(`scratch-3`);
  ctx3 = scratch3.getContext("2d");
  attachEventListener(scratch1, ctx1);
  attachEventListener(scratch2, ctx2);
  attachEventListener(scratch3, ctx3);
  setChance(50, "./raw/prize.png");

  while (images.length < 100) {
    images.push("./raw/zonk.png");
    failedCount++;
  }

  //   chosenIndex = getRandomInt(images.length);
  chosenIndex = 10;
  console.log("chosenIndex", chosenIndex);
  if (chosenIndex < 50) {
    setBackgroundImages();
  }
};
