const express = require("express");
const path = require("path");

const app = express();
const buildDir = path.join(__dirname, "html");
app.use(express.static(buildDir));
app.get("/*", (_, res) => {
  res.sendFile(path.join(buildDir, "index.html"));
});
app.listen(80, () => {console.log(`Started listening on port 80`)})