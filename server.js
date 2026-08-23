const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;
const root = __dirname;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

http
  .createServer((req, res) => {
    let urlPath;
    try {
      urlPath = decodeURIComponent(req.url.split("?")[0].split("#")[0]);
    } catch {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("400 Bad Request");
      return;
    }
    if (urlPath === "/") urlPath = "/index.html";

    const filePath = path.normalize(path.join(root, urlPath));
    if (!filePath.startsWith(root)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("400 Bad Request");
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 Not Found");
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, () => {
    console.log(`Spectrum static server listening on port ${port}`);
  });
