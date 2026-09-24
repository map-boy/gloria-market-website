const fs = require("fs");
const ImageTracer = require("imagetracerjs");
const getPixels = require("get-pixels");

getPixels("public/logo.png", function (err, pixels) {
  if (err) { console.error(err); process.exit(1); }
  const [width, height] = pixels.shape;
  const data = new Uint8ClampedArray(pixels.data.length);
  data.set(pixels.data);
  const imgd = { width, height, data };

  const svgstring = ImageTracer.imagedataToSVG(imgd, {
    numberofcolors: 24,
    pathomit: 4,
    ltres: 1,
    qtres: 1,
    strokewidth: 0,
  });

  fs.writeFileSync("public/logo.svg", svgstring);
  console.log("Wrote color SVG, size:", svgstring.length, "bytes");
});
