// src/serve-static.ts
import { createReadStream, lstatSync } from "fs";
import { getFilePath, getFilePathWithoutDefaultDocument } from "hono/utils/filepath";
import { getMimeType } from "hono/utils/mime";
var createStreamBody = (stream) => {
  const body = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      stream.on("end", () => {
        controller.close();
      });
    },
    cancel() {
      stream.destroy();
    }
  });
  return body;
};
var addCurrentDirPrefix = (path) => {
  return `./${path}`;
};
var getStats = (path) => {
  let stats;
  try {
    stats = lstatSync(path);
  } catch {
  }
  return stats;
};
var serveStatic = (options = { root: "" }) => {
  return async (c, next) => {
    if (c.finalized) {
      return next();
    }
    const filename = options.path ?? decodeURIComponent(c.req.path);
    let path = getFilePathWithoutDefaultDocument({
      filename: options.rewriteRequestPath ? options.rewriteRequestPath(filename) : filename,
      root: options.root
    });
    if (path) {
      path = addCurrentDirPrefix(path);
    } else {
      return next();
    }
    let stats = getStats(path);
    if (stats && stats.isDirectory()) {
      path = getFilePath({
        filename: options.rewriteRequestPath ? options.rewriteRequestPath(filename) : filename,
        root: options.root,
        defaultDocument: options.index ?? "index.html"
      });
      if (path) {
        path = addCurrentDirPrefix(path);
      } else {
        return next();
      }
      stats = getStats(path);
    }
    if (!stats) {
      await options.onNotFound?.(path, c);
      return next();
    }
    const mimeType = getMimeType(path);
    if (mimeType) {
      c.header("Content-Type", mimeType);
    }
    const size = stats.size;
    if (c.req.method == "HEAD" || c.req.method == "OPTIONS") {
      c.header("Content-Length", size.toString());
      c.status(200);
      return c.body(null);
    }
    const range = c.req.header("range") || "";
    if (!range) {
      c.header("Content-Length", size.toString());
      return c.body(createStreamBody(createReadStream(path)), 200);
    }
    c.header("Accept-Ranges", "bytes");
    c.header("Date", stats.birthtime.toUTCString());
    const parts = range.replace(/bytes=/, "").split("-", 2);
    const start = parts[0] ? parseInt(parts[0], 10) : 0;
    let end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
    if (size < end - start + 1) {
      end = size - 1;
    }
    const chunksize = end - start + 1;
    const stream = createReadStream(path, { start, end });
    c.header("Content-Length", chunksize.toString());
    c.header("Content-Range", `bytes ${start}-${end}/${stats.size}`);
    return c.body(createStreamBody(stream), 206);
  };
};
export {
  serveStatic
};
