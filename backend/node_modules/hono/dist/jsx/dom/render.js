// src/jsx/dom/render.ts
import { toArray } from "../children.js";
import { DOM_ERROR_HANDLER, DOM_INTERNAL_TAG, DOM_RENDERER, DOM_STASH } from "../constants.js";
import { globalContexts as globalJSXContexts, useContext } from "../context.js";
import { STASH_EFFECT } from "../hooks/index.js";
import { normalizeIntrinsicElementKey, styleObjectForEach } from "../utils.js";
import { createContext } from "./context.js";
import { newJSXNode } from "./utils.js";
var HONO_PORTAL_ELEMENT = "_hp";
var eventAliasMap = {
  Change: "Input",
  DoubleClick: "DblClick"
};
var nameSpaceMap = {
  svg: "2000/svg",
  math: "1998/Math/MathML"
};
var skipProps = /* @__PURE__ */ new Set(["children"]);
var buildDataStack = [];
var refCleanupMap = /* @__PURE__ */ new WeakMap();
var nameSpaceContext = void 0;
var getNameSpaceContext = () => nameSpaceContext;
var isNodeString = (node) => "t" in node;
var getEventSpec = (key) => {
  const match = key.match(/^on([A-Z][a-zA-Z]+?(?:PointerCapture)?)(Capture)?$/);
  if (match) {
    const [, eventName, capture] = match;
    return [(eventAliasMap[eventName] || eventName).toLowerCase(), !!capture];
  }
  return void 0;
};
var toAttributeName = (element, key) => element instanceof SVGElement && /[A-Z]/.test(key) && (key in element.style || key.match(/^(?:o|pai|str|u|ve)/)) ? key.replace(/([A-Z])/g, "-$1").toLowerCase() : key;
var applyProps = (container, attributes, oldAttributes) => {
  attributes ||= {};
  for (let [key, value] of Object.entries(attributes)) {
    if (!skipProps.has(key) && (!oldAttributes || oldAttributes[key] !== value)) {
      key = normalizeIntrinsicElementKey(key);
      const eventSpec = getEventSpec(key);
      if (eventSpec) {
        if (oldAttributes) {
          container.removeEventListener(eventSpec[0], oldAttributes[key], eventSpec[1]);
        }
        if (value != null) {
          if (typeof value !== "function") {
            throw new Error(`Event handler for "${key}" is not a function`);
          }
          container.addEventListener(eventSpec[0], value, eventSpec[1]);
        }
      } else if (key === "dangerouslySetInnerHTML" && value) {
        container.innerHTML = value.__html;
      } else if (key === "ref") {
        let cleanup;
        if (typeof value === "function") {
          cleanup = value(container) || (() => value(null));
        } else if (value && "current" in value) {
          value.current = container;
          cleanup = () => value.current = null;
        }
        refCleanupMap.set(container, cleanup);
      } else if (key === "style") {
        const style = container.style;
        if (typeof value === "string") {
          style.cssText = value;
        } else {
          style.cssText = "";
          if (value != null) {
            styleObjectForEach(value, style.setProperty.bind(style));
          }
        }
      } else {
        const nodeName = container.nodeName;
        if (key === "value") {
          if (nodeName === "INPUT" || nodeName === "TEXTAREA" || nodeName === "SELECT") {
            ;
            container.value = value === null || value === void 0 || value === false ? null : value;
            if (nodeName === "TEXTAREA") {
              container.textContent = value;
              continue;
            } else if (nodeName === "SELECT") {
              if (container.selectedIndex === -1) {
                ;
                container.selectedIndex = 0;
              }
              continue;
            }
          }
        } else if (key === "checked" && nodeName === "INPUT" || key === "selected" && nodeName === "OPTION") {
          ;
          container[key] = value;
        }
        const k = toAttributeName(container, key);
        if (value === null || value === void 0 || value === false) {
          container.removeAttribute(k);
        } else if (value === true) {
          container.setAttribute(k, "");
        } else if (typeof value === "string" || typeof value === "number") {
          container.setAttribute(k, value);
        } else {
          container.setAttribute(k, value.toString());
        }
      }
    }
  }
  if (oldAttributes) {
    for (let [key, value] of Object.entries(oldAttributes)) {
      if (!skipProps.has(key) && !(key in attributes)) {
        key = normalizeIntrinsicElementKey(key);
        const eventSpec = getEventSpec(key);
        if (eventSpec) {
          container.removeEventListener(eventSpec[0], value, eventSpec[1]);
        } else if (key === "ref") {
          refCleanupMap.get(container)?.();
        } else {
          container.removeAttribute(toAttributeName(container, key));
        }
      }
    }
  }
};
var invokeTag = (context, node) => {
  if (node.s) {
    const res = node.s;
    node.s = void 0;
    return res;
  }
  node[DOM_STASH][0] = 0;
  buildDataStack.push([context, node]);
  const func = node.tag[DOM_RENDERER] || node.tag;
  try {
    return [
      func.call(null, {
        ...func.defaultProps || {},
        ...node.props
      })
    ];
  } finally {
    buildDataStack.pop();
  }
};
var getNextChildren = (node, container, nextChildren, childrenToRemove, callbacks) => {
  childrenToRemove.push(...node.vR);
  if (typeof node.tag === "function") {
    node[DOM_STASH][1][STASH_EFFECT]?.forEach((data) => callbacks.push(data));
  }
  node.vC.forEach((child) => {
    if (isNodeString(child)) {
      nextChildren.push(child);
    } else {
      if (typeof child.tag === "function" || child.tag === "") {
        child.c = container;
        getNextChildren(child, container, nextChildren, childrenToRemove, callbacks);
      } else {
        nextChildren.push(child);
        childrenToRemove.push(...child.vR);
      }
    }
  });
};
var findInsertBefore = (node) => {
  return !node ? null : node.tag === HONO_PORTAL_ELEMENT ? findInsertBefore(node.nN) : node.e || node.vC && node.pP && findInsertBefore(node.vC[0]) || findInsertBefore(node.nN);
};
var removeNode = (node) => {
  if (!isNodeString(node)) {
    node[DOM_STASH]?.[1][STASH_EFFECT]?.forEach((data) => data[2]?.());
    refCleanupMap.get(node.e)?.();
    if (node.p === 2) {
      node.vC?.forEach((n) => n.p = 2);
    }
    node.vC?.forEach(removeNode);
  }
  if (!node.p) {
    node.e?.remove();
    delete node.e;
  }
  if (typeof node.tag === "function") {
    updateMap.delete(node);
    fallbackUpdateFnArrayMap.delete(node);
    delete node[DOM_STASH][3];
    node.a = true;
  }
};
var apply = (node, container) => {
  node.c = container;
  applyNodeObject(node, container);
};
var applyNode = (node, container) => {
  if (isNodeString(node)) {
    container.textContent = node.t;
  } else {
    applyNodeObject(node, container);
  }
};
var findChildNodeIndex = (childNodes, child) => {
  if (!child) {
    return;
  }
  for (let i = 0, len = childNodes.length; i < len; i++) {
    if (childNodes[i] === child) {
      return i;
    }
  }
  return;
};
var cancelBuild = Symbol();
var applyNodeObject = (node, container) => {
  const next = [];
  const remove = [];
  const callbacks = [];
  getNextChildren(node, container, next, remove, callbacks);
  const childNodes = container.childNodes;
  let offset = findChildNodeIndex(childNodes, findInsertBefore(node.nN)) ?? findChildNodeIndex(childNodes, next.find((n) => n.tag !== HONO_PORTAL_ELEMENT && n.e)?.e) ?? childNodes.length;
  for (let i = 0, len = next.length; i < len; i++, offset++) {
    const child = next[i];
    let el;
    if (isNodeString(child)) {
      if (child.e && child.d) {
        child.e.textContent = child.t;
      }
      child.d = false;
      el = child.e ||= document.createTextNode(child.t);
    } else {
      el = child.e ||= child.n ? document.createElementNS(child.n, child.tag) : document.createElement(child.tag);
      applyProps(el, child.props, child.pP);
      applyNode(child, el);
    }
    if (child.tag === HONO_PORTAL_ELEMENT) {
      offset--;
    } else if (childNodes[offset] !== el && childNodes[offset - 1] !== child.e) {
      container.insertBefore(el, childNodes[offset] || null);
    }
  }
  remove.forEach(removeNode);
  callbacks.forEach(([, , , , cb]) => cb?.());
  callbacks.forEach(([, cb]) => cb?.());
  requestAnimationFrame(() => {
    callbacks.forEach(([, , , cb]) => cb?.());
  });
};
var fallbackUpdateFnArrayMap = /* @__PURE__ */ new WeakMap();
var build = (context, node, children) => {
  const buildWithPreviousChildren = !children && node.pC;
  if (children) {
    node.pC ||= node.vC;
  }
  let foundErrorHandler;
  try {
    children ||= typeof node.tag == "function" ? invokeTag(context, node) : toArray(node.props.children);
    if (children[0]?.tag === "" && children[0][DOM_ERROR_HANDLER]) {
      foundErrorHandler = children[0][DOM_ERROR_HANDLER];
      context[5].push([context, foundErrorHandler, node]);
    }
    const oldVChildren = buildWithPreviousChildren ? [...node.pC] : node.vC ? [...node.vC] : [];
    const vChildren = [];
    node.vR = buildWithPreviousChildren ? [...node.vC] : [];
    let prevNode;
    children.flat().forEach((c) => {
      let child = buildNode(c);
      if (child) {
        if (typeof child.tag === "function" && !child.tag[DOM_INTERNAL_TAG]) {
          if (globalJSXContexts.length > 0) {
            child[DOM_STASH][2] = globalJSXContexts.map((c2) => [c2, c2.values.at(-1)]);
          }
          if (context[5]?.length) {
            child[DOM_STASH][3] = context[5].at(-1);
          }
        }
        let oldChild;
        const i = oldVChildren.findIndex(
          isNodeString(child) ? (c2) => isNodeString(c2) : child.key !== void 0 ? (c2) => c2.key === child.key : (c2) => c2.tag === child.tag
        );
        if (i !== -1) {
          oldChild = oldVChildren[i];
          oldVChildren.splice(i, 1);
        }
        let skipBuild = false;
        if (oldChild) {
          if (isNodeString(child)) {
            if (oldChild.t !== child.t) {
              ;
              oldChild.t = child.t;
              oldChild.d = true;
            }
            child = oldChild;
          } else if (oldChild.tag !== child.tag) {
            node.vR.push(oldChild);
          } else {
            const pP = oldChild.pP = oldChild.props;
            oldChild.props = child.props;
            oldChild.f ||= child.f || node.f;
            if (typeof child.tag === "function") {
              oldChild[DOM_STASH][2] = child[DOM_STASH][2] || [];
              oldChild[DOM_STASH][3] = child[DOM_STASH][3];
              if (!oldChild.f) {
                const prevPropsKeys = Object.keys(pP);
                const currentProps = oldChild.props;
                skipBuild = prevPropsKeys.length === Object.keys(currentProps).length && prevPropsKeys.every((k) => k in currentProps && currentProps[k] === pP[k]);
              }
            }
            child = oldChild;
          }
        } else if (!isNodeString(child) && nameSpaceContext) {
          const ns = useContext(nameSpaceContext);
          if (ns) {
            child.n = ns;
          }
        }
        if (!isNodeString(child) && !skipBuild) {
          build(context, child);
          delete child.f;
        }
        vChildren.push(child);
        for (let p = prevNode; p && !isNodeString(p); p = p.vC?.at(-1)) {
          p.nN = child;
        }
        prevNode = child;
      }
    });
    node.vC = vChildren;
    node.vR.push(...oldVChildren);
    if (buildWithPreviousChildren) {
      delete node.pC;
    }
  } catch (e) {
    node.f = true;
    if (e === cancelBuild) {
      if (foundErrorHandler) {
        return;
      } else {
        throw e;
      }
    }
    const [errorHandlerContext, errorHandler, errorHandlerNode] = node[DOM_STASH]?.[3] || [];
    if (errorHandler) {
      const fallbackUpdateFn = () => update([0, false, context[2]], errorHandlerNode);
      const fallbackUpdateFnArray = fallbackUpdateFnArrayMap.get(errorHandlerNode) || [];
      fallbackUpdateFnArray.push(fallbackUpdateFn);
      fallbackUpdateFnArrayMap.set(errorHandlerNode, fallbackUpdateFnArray);
      const fallback = errorHandler(e, () => {
        const fnArray = fallbackUpdateFnArrayMap.get(errorHandlerNode);
        if (fnArray) {
          const i = fnArray.indexOf(fallbackUpdateFn);
          if (i !== -1) {
            fnArray.splice(i, 1);
            return fallbackUpdateFn();
          }
        }
      });
      if (fallback) {
        if (context[0] === 1) {
          context[1] = true;
        } else {
          build(context, errorHandlerNode, [fallback]);
          if ((errorHandler.length === 1 || context !== errorHandlerContext) && errorHandlerNode.c) {
            apply(errorHandlerNode, errorHandlerNode.c);
            return;
          }
        }
        throw cancelBuild;
      }
    }
    throw e;
  } finally {
    if (foundErrorHandler) {
      context[5].pop();
    }
  }
};
var buildNode = (node) => {
  if (node === void 0 || node === null || typeof node === "boolean") {
    return void 0;
  } else if (typeof node === "string" || typeof node === "number") {
    return { t: node.toString(), d: true };
  } else {
    if ("vR" in node) {
      node = newJSXNode({
        tag: node.tag,
        props: node.props,
        key: node.key,
        f: node.f
      });
    }
    if (typeof node.tag === "function") {
      ;
      node[DOM_STASH] = [0, []];
    } else {
      const ns = nameSpaceMap[node.tag];
      if (ns) {
        nameSpaceContext ||= createContext("");
        node.props.children = [
          {
            tag: nameSpaceContext,
            props: {
              value: node.n = `http://www.w3.org/${ns}`,
              children: node.props.children
            }
          }
        ];
      }
    }
    return node;
  }
};
var replaceContainer = (node, from, to) => {
  if (node.c === from) {
    node.c = to;
    node.vC.forEach((child) => replaceContainer(child, from, to));
  }
};
var updateSync = (context, node) => {
  node[DOM_STASH][2]?.forEach(([c, v]) => {
    c.values.push(v);
  });
  try {
    build(context, node, void 0);
  } catch (e) {
    return;
  }
  if (node.a) {
    delete node.a;
    return;
  }
  node[DOM_STASH][2]?.forEach(([c]) => {
    c.values.pop();
  });
  if (context[0] !== 1 || !context[1]) {
    apply(node, node.c);
  }
};
var updateMap = /* @__PURE__ */ new WeakMap();
var currentUpdateSets = [];
var update = async (context, node) => {
  context[5] ||= [];
  const existing = updateMap.get(node);
  if (existing) {
    existing[0](void 0);
  }
  let resolve;
  const promise = new Promise((r) => resolve = r);
  updateMap.set(node, [
    resolve,
    () => {
      if (context[2]) {
        context[2](context, node, (context2) => {
          updateSync(context2, node);
        }).then(() => resolve(node));
      } else {
        updateSync(context, node);
        resolve(node);
      }
    }
  ]);
  if (currentUpdateSets.length) {
    ;
    currentUpdateSets.at(-1).add(node);
  } else {
    await Promise.resolve();
    const latest = updateMap.get(node);
    if (latest) {
      updateMap.delete(node);
      latest[1]();
    }
  }
  return promise;
};
var renderNode = (node, container) => {
  const context = [];
  context[5] = [];
  context[4] = true;
  build(context, node, void 0);
  context[4] = false;
  const fragment = document.createDocumentFragment();
  apply(node, fragment);
  replaceContainer(node, fragment, container);
  container.replaceChildren(fragment);
};
var render = (jsxNode, container) => {
  renderNode(buildNode({ tag: "", props: { children: jsxNode } }), container);
};
var flushSync = (callback) => {
  const set = /* @__PURE__ */ new Set();
  currentUpdateSets.push(set);
  callback();
  set.forEach((node) => {
    const latest = updateMap.get(node);
    if (latest) {
      updateMap.delete(node);
      latest[1]();
    }
  });
  currentUpdateSets.pop();
};
var createPortal = (children, container, key) => ({
  tag: HONO_PORTAL_ELEMENT,
  props: {
    children
  },
  key,
  e: container,
  p: 1
});
export {
  build,
  buildDataStack,
  buildNode,
  createPortal,
  flushSync,
  getNameSpaceContext,
  render,
  renderNode,
  update
};
