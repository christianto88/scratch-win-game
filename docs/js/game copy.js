var timeout = null;
var images = [];
var chosenIndex = [];
var failedCount = 0;
var scratch1, scratch2, scratch3;
var ctx1, ctx2, ctx3;
var selectedBoxId;
var ongoingTouches = [];

function copyTouch(touch, id) {
  return {
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY,
    id
  };
}
handleTouchStart = function (event) {
  event.preventDefault();
  console.log("handle touchstart.");
  // var el = document.getElementById("canvas");
  // var ctx = el.getContext("2d");
  var touches = event.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    console.log("touchstart:" + i + "...");
    ongoingTouches.push(copyTouch(touches[i], event.target.id));
    // var color = colorForTouch(touches[i]);
    // ctx.beginPath();
    // ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
    // ctx.fillStyle = color;
    // ctx.fill();
    // console.log("touchstart:" + i + ".");
  }
  console.log("onging len", ongoingTouches.length);
};
attachEventListener = function (c, ctx) {
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, 175, 175);
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    console.log("isMobile");
    // c.addEventListener("touchstart", handleTouchStart, false);
    c.addEventListener("touchmove", deleteTouchArea);
    c.addEventListener(
      "ontouchend",
      function () {
        c.removeEventListener("ontouchmove", deleteTouchArea);
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
      },
      false
    );
    // c.addEventListener("touchstart", function () {
    //   console.log("touchstart");
    //   if (timeout) {
    //     clearTimeout(timeout);
    //   }

    //   // c.addEventListener("touchmove", deleteTouchArea);

    // });
  } else {
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
  }
};
function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1; // not found
}
function deleteTouchArea(event) {
  event.preventDefault();
  let ctx;
  console.log("touch id", event);
  if (event.target.id === "scratch-1") {
    ctx = ctx1;
  } else if (event.target.id === "scratch-2") {
    ctx = ctx2;
  } else if (event.target.id === "scratch-3") {
    ctx = ctx3;
  }
  console.log("x", event.touches[0].clientX);
  console.log("y", event.touches[0].clientY);

  ctx.arc(
    event.touches[0].radiusX,
    event.touches[0].radiusY,
    15,
    0,
    2 * Math.PI
  );
  ctx.save();
  ctx.clip();
  ctx.clearRect(
    event.touches[0].radiusX - 15,
    event.touches[0].radiusY - 15,
    30,
    30
  );
  ctx.restore();
  // console.log("!!!", event);

  // console.log("1", ongoingTouches);
  // var touches = event.changedTouches;
  // console.log("11", touches);
  // for (var i = 0; i < touches.length; i++) {
  //   var idx = ongoingTouchIndexById(touches[i].identifier);

  //   if (idx >= 0) {
  //     console.log("continuing touch " + idx);
  //     const touch = ongoingTouches[idx];
  //     let ctx;
  //     console.log("touch id", touch);
  //     if (touch.id === "scratch-1") {
  //       ctx = ctx1;
  //     } else if (touch.id === "scratch-2") {
  //       ctx = ctx2;
  //     } else if (touch.id === "scratch-3") {
  //       ctx = ctx3;
  //     }
  //     ctx.arc(touch.pageX, touch.pageY, 15, 0, 2 * Math.PI);
  //     ctx.save();
  //     ctx.clip();
  //     ctx.clearRect(touch.pageX - 15, touch.pageY - 15, 30, 30);
  //     ctx.restore();
  //     // ctx.beginPath();
  //     // console.log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
  //     // ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
  //     // console.log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
  //     // ctx.lineTo(touches[i].pageX, touches[i].pageY);
  //     // ctx.lineWidth = 4;
  //     // ctx.strokeStyle = color;
  //     // ctx.stroke();

  //     ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
  //     console.log(".");
  //   } else {
  //     console.log("can't figure out which touch to continue");
  //   }
  // }
}
function deleteArea(props) {
  const { layerX, layerY, target } = props;
  console.log("layer x", layerX);
  console.log("layer y", layerY);

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

  chosenIndex = getRandomInt(images.length);
  chosenIndex = 10;
  // console.log("chosenIndex", chosenIndex);
  if (chosenIndex < 50) {
    setBackgroundImages();
  }
};
