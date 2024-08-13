// src/jsx/dom/jsx-dev-runtime.ts
import { newJSXNode } from "./utils.js";
import * as intrinsicElementTags from "./intrinsic-element/components.js";
var jsxDEV = (tag, props, key) => {
  return newJSXNode({
    tag: typeof tag === "string" && intrinsicElementTags[tag] || tag,
    props,
    key
  });
};
var Fragment = (props) => jsxDEV("", props, void 0);
export {
  Fragment,
  jsxDEV
};
