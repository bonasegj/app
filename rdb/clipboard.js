const copy = async (img) => {
  // This assumes you have marked up images like so:
  // <img
  //    src="foo.svg"
  //    data-mime-type="image/svg+xml"
  //    alt="Foo">
  //
  // Applying this markup could be automated
  // (for all applicable MIME types):
  //
  // document.querySelectorAll('img[src*=".svg"]')
  // .forEach((img) => {
  //   img.dataset.mimeType = 'image/svg+xml';
  // });
  const mimeType = img.dataset.mimeType;
  // Always create a textual representation based on the
  // `alt` text, or based on the source code for SVG images.
  let text = null;
  if (mimeType === "image/svg+xml") {
    text = await toSourceBlob(img);
  } else {
    text = new Blob([img.alt], { type: "text/plain" });
  }
  const clipboardData = {};
  //const clipboardData = {
  //  "text/plain": text,
  //};
  // Always create a PNG representation.
  clipboardData["image/png"] = await toPNGBlob(img);
  // When dealing with a non-PNG image, create a
  // representation in the MIME type in question.
  if (mimeType !== "image/png") {
    clipboardData[mimeType] = await toOriginBlob(img);
  }
  try {
    await navigator.clipboard.write([new ClipboardItem(clipboardData)]);
  } catch (err) {
    // Currently only `text/plain` and `image/png` are
    // implemented, so if there is a `NotAllowedError`,
    // remove the other representation.
    console.warn(err.name, err.message);
    if (err.name === "NotAllowedError") {
      const disallowedMimeType = err.message.replace(
        /^.*?\s(\w+\/[^\s]+).*?$/,
        "$1"
      );
      delete clipboardData[disallowedMimeType];
      try {
        await navigator.clipboard.write([new ClipboardItem(clipboardData)]);
      } catch (err) {
        throw err;
      }
    }
  }
  // Log what's ultimately on the clipboard.
  console.log(clipboardData);

  //const realText = await text.text();
  //console.log("realText: " + realText);
  setTimeout(() => window.open("https://wa.me/541150329058"), 1000);
};

// Draws an image on an offscreen canvas
// and converts it to a PNG blob.
const toPNGBlob = async (img) => {
  const canvas = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
  const ctx = canvas.getContext("2d");
  // This removes transparency. Remove at will.
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  return await canvas.convertToBlob();
};

// Fetches an image resource and returns
// its blob of whatever MIME type.
const toOriginBlob = async (img) => {
  const response = await fetch(img.src);
  return await response.blob();
};

// Fetches an SVG image resource and returns
// a blob based on the source code.
const toSourceBlob = async (img) => {
  const response = await fetch(img.src);
  const source = await response.text();
  return new Blob([source], { type: "text/plain" });
};
