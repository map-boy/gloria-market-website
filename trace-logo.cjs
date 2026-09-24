const fs = require("fs");
const potrace = require("potrace");

potrace.posterize(
  "public/logo.png",
  { threshold: 200, steps: 6, color: "auto", background: "transparent" },
  (err, svg) => {
    if (err) throw err;
    fs.writeFileSync("public/logo.svg", svg);
    console.log("Wrote public/logo.svg, size:", svg.length, "bytes");
  }
);
