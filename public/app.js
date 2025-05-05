import {
  fetchPondiverseCreation,
  getPondiverseCreationImageUrl,
  addPondiverseButton,
} from "https://www.pondiverse.com/pondiverse.js";

const canvas = document.getElementById("meme-canvas");
const ctx = canvas.getContext("2d");
const textInput = document.getElementById("meme-text");
const updateBtn = document.getElementById("update-meme");

function drawMeme(meme) {
  console.log("Drawing meme: ", meme);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (meme.image) {
    ctx.drawImage(meme.image, 0, 0, canvas.width, canvas.height);
  }
  if (meme.text) {
    ctx.font = "bold 40px Impact";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";

    const x = canvas.width / 2;
    let y = 20;
    const lineHeight = 48; // Adjust as needed

    const lines = meme.text.split("\n");
    for (const line of lines) {
      ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
      y += lineHeight;
    }
  }
}

function setImageFromUrl(memeState, url) {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      memeState.image = img;
      drawMeme(memeState);
      resolve();
    };
    img.src = url;
  });
}

function setupPondiverseButton(memeState) {
  addPondiverseButton(() => {
    const data = {
      text: memeState.text,
      original: memeState.creation,
    };
    console.log("Meme data: ", data);
    return {
      type: "meme",
      data: JSON.stringify(data),
      image: canvas.toDataURL("image/png"),
    };
  });
}

function main() {
  const urlParams = new URLSearchParams(window.location.search);
  const creationId = urlParams.get("creation");

  const memeState = {
    creation: null,
    image: null,
    text: textInput.value.toUpperCase(),
  };

  if (creationId) {
    fetchPondiverseCreation(creationId).then((creation) => {
      memeState.creation = creation;
      const imageUrl = getPondiverseCreationImageUrl(creation);
      setImageFromUrl(memeState, imageUrl);
    });
  }

  console.log("Meme creation app loaded: ", textInput, creationId);
  textInput.addEventListener("input", () => {
    memeState.text = textInput.value.toUpperCase();
    drawMeme(memeState);
  });

  drawMeme(memeState);

  setupPondiverseButton(memeState);
}

main();
