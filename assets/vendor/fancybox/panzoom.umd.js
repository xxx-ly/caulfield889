!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? e(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], e)
    : e(
        ((t =
          "undefined" != typeof globalThis ? globalThis : t || self).window =
          t.window || {})
      );
})(this, function (t) {
  "use strict";
  const e = (t, e = 1e4) => (
      (t = parseFloat(t + "") || 0), Math.round((t + Number.EPSILON) * e) / e
    ),
    i = function (t, e = void 0) {
      return (
        !(!t || t === document.body || (e && t === e)) &&
        ((function (t) {
          if (!(t && t instanceof Element && t.offsetParent)) return !1;
          const e = t.scrollHeight > t.clientHeight,
            i = window.getComputedStyle(t).overflowY,
            n = -1 !== i.indexOf("hidden"),
            s = -1 !== i.indexOf("visible");
          return e && !n && !s;
        })(t)
          ? t
          : i(t.parentElement, e))
      );
    },
    n = (t) => `${t || ""}`.split(" ").filter((t) => !!t),
    s = (t, e, i) => {
      t &&
        n(e).forEach((e) => {
          t.classList.toggle(e, i || !1);
        });
    };
  class o {
    constructor(t) {
      Object.defineProperty(this, "pageX", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
        Object.defineProperty(this, "pageY", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "clientX", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "clientY", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "id", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "time", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "nativePointer", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        (this.nativePointer = t),
        (this.pageX = t.pageX),
        (this.pageY = t.pageY),
        (this.clientX = t.clientX),
        (this.clientY = t.clientY),
        (this.id = self.Touch && t instanceof Touch ? t.identifier : -1),
        (this.time = Date.now());
    }
  }
  const r = { passive: !1 };
  class a {
    constructor(
      t,
      { start: e = () => !0, move: i = () => {}, end: n = () => {} }
    ) {
      Object.defineProperty(this, "element", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
        Object.defineProperty(this, "startCallback", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "moveCallback", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "endCallback", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "currentPointers", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: [],
        }),
        Object.defineProperty(this, "startPointers", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: [],
        }),
        (this.element = t),
        (this.startCallback = e),
        (this.moveCallback = i),
        (this.endCallback = n);
      for (const t of [
        "onPointerStart",
        "onTouchStart",
        "onMove",
        "onTouchEnd",
        "onPointerEnd",
        "onWindowBlur",
      ])
        this[t] = this[t].bind(this);
      this.element.addEventListener("mousedown", this.onPointerStart, r),
        this.element.addEventListener("touchstart", this.onTouchStart, r),
        this.element.addEventListener("touchmove", this.onMove, r),
        this.element.addEventListener("touchend", this.onTouchEnd),
        this.element.addEventListener("touchcancel", this.onTouchEnd);
    }
    onPointerStart(t) {
      if (!t.buttons || 0 !== t.button) return;
      const e = new o(t);
      this.currentPointers.some((t) => t.id === e.id) ||
        (this.triggerPointerStart(e, t) &&
          (window.addEventListener("mousemove", this.onMove),
          window.addEventListener("mouseup", this.onPointerEnd),
          window.addEventListener("blur", this.onWindowBlur)));
    }
    onTouchStart(t) {
      for (const e of Array.from(t.changedTouches || []))
        this.triggerPointerStart(new o(e), t);
      window.addEventListener("blur", this.onWindowBlur);
    }
    onMove(t) {
      const e = this.currentPointers.slice(),
        i =
          "changedTouches" in t
            ? Array.from(t.changedTouches || []).map((t) => new o(t))
            : [new o(t)],
        n = [];
      for (const t of i) {
        const e = this.currentPointers.findIndex((e) => e.id === t.id);
        e < 0 || (n.push(t), (this.currentPointers[e] = t));
      }
      n.length && this.moveCallback(t, this.currentPointers.slice(), e);
    }
    onPointerEnd(t) {
      (t.buttons > 0 && 0 !== t.button) ||
        (this.triggerPointerEnd(t, new o(t)),
        window.removeEventListener("mousemove", this.onMove),
        window.removeEventListener("mouseup", this.onPointerEnd),
        window.removeEventListener("blur", this.onWindowBlur));
    }
    onTouchEnd(t) {
      for (const e of Array.from(t.changedTouches || []))
        this.triggerPointerEnd(t, new o(e));
    }
    triggerPointerStart(t, e) {
      return (
        !!this.startCallback(e, t, this.currentPointers.slice()) &&
        (this.currentPointers.push(t), this.startPointers.push(t), !0)
      );
    }
    triggerPointerEnd(t, e) {
      const i = this.currentPointers.findIndex((t) => t.id === e.id);
      i < 0 ||
        (this.currentPointers.splice(i, 1),
        this.startPointers.splice(i, 1),
        this.endCallback(t, e, this.currentPointers.slice()));
    }
    onWindowBlur() {
      this.clear();
    }
    clear() {
      for (; this.currentPointers.length; ) {
        const t = this.currentPointers[this.currentPointers.length - 1];
        this.currentPointers.splice(this.currentPointers.length - 1, 1),
          this.startPointers.splice(this.currentPointers.length - 1, 1),
          this.endCallback(
            new Event("touchend", {
              bubbles: !0,
              cancelable: !0,
              clientX: t.clientX,
              clientY: t.clientY,
            }),
            t,
            this.currentPointers.slice()
          );
      }
    }
    stop() {
      this.element.removeEventListener("mousedown", this.onPointerStart, r),
        this.element.removeEventListener("touchstart", this.onTouchStart, r),
        this.element.removeEventListener("touchmove", this.onMove, r),
        this.element.removeEventListener("touchend", this.onTouchEnd),
        this.element.removeEventListener("touchcancel", this.onTouchEnd),
        window.removeEventListener("mousemove", this.onMove),
        window.removeEventListener("mouseup", this.onPointerEnd),
        window.removeEventListener("blur", this.onWindowBlur);
    }
  }
  function h(t, e) {
    return e
      ? Math.sqrt(
          Math.pow(e.clientX - t.clientX, 2) +
            Math.pow(e.clientY - t.clientY, 2)
        )
      : 0;
  }
  function c(t, e) {
    return e
      ? {
          clientX: (t.clientX + e.clientX) / 2,
          clientY: (t.clientY + e.clientY) / 2,
        }
      : t;
  }
  const l = (t, ...e) => {
      const i = e.length;
      for (let n = 0; n < i; n++) {
        const i = e[n] || {};
        Object.entries(i).forEach(([e, i]) => {
          const n = Array.isArray(i) ? [] : {};
          var s;
          t[e] || Object.assign(t, { [e]: n }),
            "object" == typeof (s = i) &&
            null !== s &&
            s.constructor === Object &&
            "[object Object]" === Object.prototype.toString.call(s)
              ? Object.assign(t[e], l(n, i))
              : Array.isArray(i)
              ? Object.assign(t, { [e]: [...i] })
              : Object.assign(t, { [e]: i });
        });
      }
      return t;
    },
    u = function (t, e) {
      return t
        .split(".")
        .reduce((t, e) => ("object" == typeof t ? t[e] : void 0), e);
    };
  class d {
    constructor(t = {}) {
      Object.defineProperty(this, "options", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
        Object.defineProperty(this, "events", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: new Map(),
        }),
        this.setOptions(t);
      for (const t of Object.getOwnPropertyNames(Object.getPrototypeOf(this)))
        t.startsWith("on") &&
          "function" == typeof this[t] &&
          (this[t] = this[t].bind(this));
    }
    setOptions(t) {
      this.options = t ? l({}, this.constructor.defaults, t) : {};
      for (const [t, e] of Object.entries(this.option("on") || {}))
        this.on(t, e);
    }
    option(t, ...e) {
      let i = u(t, this.options);
      return i && "function" == typeof i && (i = i.call(this, this, ...e)), i;
    }
    optionFor(t, e, i, ...n) {
      let s = u(e, t);
      var o;
      "string" != typeof (o = s) ||
        isNaN(o) ||
        isNaN(parseFloat(o)) ||
        (s = parseFloat(s)),
        "true" === s && (s = !0),
        "false" === s && (s = !1),
        s && "function" == typeof s && (s = s.call(this, this, t, ...n));
      let r = u(e, this.options);
      return (
        r && "function" == typeof r
          ? (s = r.call(this, this, t, ...n, s))
          : void 0 === s && (s = r),
        void 0 === s ? i : s
      );
    }
    cn(t) {
      const e = this.options.classes;
      return (e && e[t]) || "";
    }
    localize(t, e = []) {
      t = String(t).replace(/\{\{(\w+).?(\w+)?\}\}/g, (t, e, i) => {
        let n = "";
        return (
          i
            ? (n = this.option(
                `${e[0] + e.toLowerCase().substring(1)}.l10n.${i}`
              ))
            : e && (n = this.option(`l10n.${e}`)),
          n || (n = t),
          n
        );
      });
      for (let i = 0; i < e.length; i++) t = t.split(e[i][0]).join(e[i][1]);
      return (t = t.replace(/\{\{(.*?)\}\}/g, (t, e) => e));
    }
    on(t, e) {
      let i = [];
      "string" == typeof t ? (i = t.split(" ")) : Array.isArray(t) && (i = t),
        this.events || (this.events = new Map()),
        i.forEach((t) => {
          let i = this.events.get(t);
          i || (this.events.set(t, []), (i = [])),
            i.includes(e) || i.push(e),
            this.events.set(t, i);
        });
    }
    off(t, e) {
      let i = [];
      "string" == typeof t ? (i = t.split(" ")) : Array.isArray(t) && (i = t),
        i.forEach((t) => {
          const i = this.events.get(t);
          if (Array.isArray(i)) {
            const t = i.indexOf(e);
            t > -1 && i.splice(t, 1);
          }
        });
    }
    emit(t, ...e) {
      [...(this.events.get(t) || [])].forEach((t) => t(this, ...e)),
        "*" !== t && this.emit("*", t, ...e);
    }
  }
  Object.defineProperty(d, "version", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: "5.0.36",
  }),
    Object.defineProperty(d, "defaults", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: {},
    });
  class g extends d {
    constructor(t = {}) {
      super(t),
        Object.defineProperty(this, "plugins", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: {},
        });
    }
    attachPlugins(t = {}) {
      const e = new Map();
      for (const [i, n] of Object.entries(t)) {
        const t = this.option(i),
          s = this.plugins[i];
        s || !1 === t
          ? s && !1 === t && (s.detach(), delete this.plugins[i])
          : e.set(i, new n(this, t || {}));
      }
      for (const [t, i] of e) (this.plugins[t] = i), i.attach();
    }
    detachPlugins(t) {
      t = t || Object.keys(this.plugins);
      for (const e of t) {
        const t = this.plugins[e];
        t && t.detach(), delete this.plugins[e];
      }
      return this.emit("detachPlugins"), this;
    }
  }
  var f;
  !(function (t) {
    (t[(t.Init = 0)] = "Init"),
      (t[(t.Error = 1)] = "Error"),
      (t[(t.Ready = 2)] = "Ready"),
      (t[(t.Panning = 3)] = "Panning"),
      (t[(t.Mousemove = 4)] = "Mousemove"),
      (t[(t.Destroy = 5)] = "Destroy");
  })(f || (f = {}));
  const m = ["a", "b", "c", "d", "e", "f"],
    p = {
      content: null,
      width: "auto",
      height: "auto",
      panMode: "drag",
      touch: !0,
      dragMinThreshold: 3,
      lockAxis: !1,
      mouseMoveFactor: 1,
      mouseMoveFriction: 0.12,
      zoom: !0,
      pinchToZoom: !0,
      panOnlyZoomed: "auto",
      minScale: 1,
      maxScale: 2,
      friction: 0.25,
      dragFriction: 0.35,
      decelFriction: 0.05,
      click: "toggleZoom",
      dblClick: !1,
      wheel: "zoom",
      wheelLimit: 7,
      spinner: !0,
      bounds: "auto",
      infinite: !1,
      rubberband: !0,
      bounce: !0,
      maxVelocity: 75,
      transformParent: !1,
      classes: {
        content: "f-panzoom__content",
        isLoading: "is-loading",
        canZoomIn: "can-zoom_in",
        canZoomOut: "can-zoom_out",
        isDraggable: "is-draggable",
        isDragging: "is-dragging",
        inFullscreen: "in-fullscreen",
        htmlHasFullscreen: "with-panzoom-in-fullscreen",
      },
      l10n: {
        PANUP: "Move up",
        PANDOWN: "Move down",
        PANLEFT: "Move left",
        PANRIGHT: "Move right",
        ZOOMIN: "Zoom in",
        ZOOMOUT: "Zoom out",
        TOGGLEZOOM: "Toggle zoom level",
        TOGGLE1TO1: "Toggle zoom level",
        ITERATEZOOM: "Toggle zoom level",
        ROTATECCW: "Rotate counterclockwise",
        ROTATECW: "Rotate clockwise",
        FLIPX: "Flip horizontally",
        FLIPY: "Flip vertically",
        FITX: "Fit horizontally",
        FITY: "Fit vertically",
        RESET: "Reset",
        TOGGLEFS: "Toggle fullscreen",
      },
    },
    b = '<circle cx="25" cy="25" r="20"></circle>',
    v =
      '<div class="f-spinner"><svg viewBox="0 0 50 50">' +
      b +
      b +
      "</svg></div>",
    y = (t, e) => {
      t &&
        n(e).forEach((e) => {
          t.classList.remove(e);
        });
    },
    w = (t, e) => {
      t &&
        n(e).forEach((e) => {
          t.classList.add(e);
        });
    },
    M = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
    P = 1e5,
    x = 1e4,
    O = "mousemove",
    T = "drag",
    S = "content",
    E = "auto";
  let k = null,
    C = null;
  class A extends g {
    get fits() {
      return (
        this.contentRect.width - this.contentRect.fitWidth < 1 &&
        this.contentRect.height - this.contentRect.fitHeight < 1
      );
    }
    get isTouchDevice() {
      return null === C && (C = window.matchMedia("(hover: none)").matches), C;
    }
    get isMobile() {
      return (
        null === k &&
          (k = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)),
        k
      );
    }
    get panMode() {
      return this.options.panMode !== O || this.isTouchDevice ? T : O;
    }
    get panOnlyZoomed() {
      const t = this.options.panOnlyZoomed;
      return t === E ? this.isTouchDevice : t;
    }
    get isInfinite() {
      return this.option("infinite");
    }
    get angle() {
      return (180 * Math.atan2(this.current.b, this.current.a)) / Math.PI || 0;
    }
    get targetAngle() {
      return (180 * Math.atan2(this.target.b, this.target.a)) / Math.PI || 0;
    }
    get scale() {
      const { a: t, b: e } = this.current;
      return Math.sqrt(t * t + e * e) || 1;
    }
    get targetScale() {
      const { a: t, b: e } = this.target;
      return Math.sqrt(t * t + e * e) || 1;
    }
    get minScale() {
      return this.option("minScale") || 1;
    }
    get fullScale() {
      const { contentRect: t } = this;
      return t.fullWidth / t.fitWidth || 1;
    }
    get maxScale() {
      return this.fullScale * (this.option("maxScale") || 1) || 1;
    }
    get coverScale() {
      const { containerRect: t, contentRect: e } = this,
        i = Math.max(t.height / e.fitHeight, t.width / e.fitWidth) || 1;
      return Math.min(this.fullScale, i);
    }
    get isScaling() {
      return Math.abs(this.targetScale - this.scale) > 1e-5 && !this.isResting;
    }
    get isContentLoading() {
      const t = this.content;
      return !!(t && t instanceof HTMLImageElement) && !t.complete;
    }
    get isResting() {
      if (this.isBouncingX || this.isBouncingY) return !1;
      for (const t of m) {
        const e = "e" == t || "f" === t ? 1e-4 : 1e-5;
        if (Math.abs(this.target[t] - this.current[t]) > e) return !1;
      }
      return !(!this.ignoreBounds && !this.checkBounds().inBounds);
    }
    constructor(t, e = {}, i = {}) {
      var n;
      if (
        (super(e),
        Object.defineProperty(this, "pointerTracker", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: null,
        }),
        Object.defineProperty(this, "resizeObserver", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: null,
        }),
        Object.defineProperty(this, "updateTimer", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: null,
        }),
        Object.defineProperty(this, "clickTimer", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: null,
        }),
        Object.defineProperty(this, "rAF", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: null,
        }),
        Object.defineProperty(this, "isTicking", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1,
        }),
        Object.defineProperty(this, "ignoreBounds", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1,
        }),
        Object.defineProperty(this, "isBouncingX", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1,
        }),
        Object.defineProperty(this, "isBouncingY", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1,
        }),
        Object.defineProperty(this, "clicks", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 0,
        }),
        Object.defineProperty(this, "trackingPoints", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: [],
        }),
        Object.defineProperty(this, "pwt", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 0,
        }),
        Object.defineProperty(this, "cwd", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 0,
        }),
        Object.defineProperty(this, "pmme", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "friction", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 0,
        }),
        Object.defineProperty(this, "state", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: f.Init,
        }),
        Object.defineProperty(this, "isDragging", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1,
        }),
        Object.defineProperty(this, "container", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "content", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "spinner", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: null,
        }),
        Object.defineProperty(this, "containerRect", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: { width: 0, height: 0, innerWidth: 0, innerHeight: 0 },
        }),
        Object.defineProperty(this, "contentRect", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            fullWidth: 0,
            fullHeight: 0,
            fitWidth: 0,
            fitHeight: 0,
            width: 0,
            height: 0,
          },
        }),
        Object.defineProperty(this, "dragStart", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: { x: 0, y: 0, top: 0, left: 0, time: 0 },
        }),
        Object.defineProperty(this, "dragOffset", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: { x: 0, y: 0, time: 0 },
        }),
        Object.defineProperty(this, "current", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: Object.assign({}, M),
        }),
        Object.defineProperty(this, "target", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: Object.assign({}, M),
        }),
        Object.defineProperty(this, "velocity", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 },
        }),
        Object.defineProperty(this, "lockedAxis", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: !1,
        }),
        !t)
      )
        throw new Error("Container Element Not Found");
      (this.container = t),
        this.initContent(),
        this.attachPlugins(Object.assign(Object.assign({}, A.Plugins), i)),
        this.emit("attachPlugins"),
        this.emit("init");
      const s = this.content;
      if (
        (s.addEventListener("load", this.onLoad),
        s.addEventListener("error", this.onError),
        this.isContentLoading)
      ) {
        if (this.option("spinner")) {
          t.classList.add(this.cn("isLoading"));
          const e = (function (t) {
            var e = new DOMParser().parseFromString(t, "text/html").body;
            if (e.childElementCount > 1) {
              for (var i = document.createElement("div"); e.firstChild; )
                i.appendChild(e.firstChild);
              return i;
            }
            return e.firstChild;
          })(v);
          !t.contains(s) || s.parentElement instanceof HTMLPictureElement
            ? (this.spinner = t.appendChild(e))
            : (this.spinner =
                (null === (n = s.parentElement) || void 0 === n
                  ? void 0
                  : n.insertBefore(e, s)) || null);
        }
        this.emit("beforeLoad");
      } else
        queueMicrotask(() => {
          this.enable();
        });
    }
    initContent() {
      const { container: t } = this,
        e = this.cn(S);
      let i = this.option(S) || t.querySelector(`.${e}`);
      if (
        (i ||
          ((i = t.querySelector("img,picture") || t.firstElementChild),
          i && w(i, e)),
        i instanceof HTMLPictureElement && (i = i.querySelector("img")),
        !i)
      )
        throw new Error("No content found");
      this.content = i;
    }
    onLoad() {
      const { spinner: t, container: e, state: i } = this;
      t && (t.remove(), (this.spinner = null)),
        this.option("spinner") && e.classList.remove(this.cn("isLoading")),
        this.emit("afterLoad"),
        i === f.Init ? this.enable() : this.updateMetrics();
    }
    onError() {
      this.state !== f.Destroy &&
        (this.spinner && (this.spinner.remove(), (this.spinner = null)),
        this.stop(),
        this.detachEvents(),
        (this.state = f.Error),
        this.emit("error"));
    }
    getNextScale(t) {
      const {
        fullScale: e,
        targetScale: i,
        coverScale: n,
        maxScale: s,
        minScale: o,
      } = this;
      let r = o;
      switch (t) {
        case "toggleMax":
          r = i - o < 0.5 * (s - o) ? s : o;
          break;
        case "toggleCover":
          r = i - o < 0.5 * (n - o) ? n : o;
          break;
        case "toggleZoom":
          r = i - o < 0.5 * (e - o) ? e : o;
          break;
        case "iterateZoom":
          let t = [1, e, s].sort((t, e) => t - e),
            a = t.findIndex((t) => t > i + 1e-5);
          r = t[a] || 1;
      }
      return r;
    }
    attachObserver() {
      var t;
      const e = () => {
        const { container: t, containerRect: e } = this;
        return (
          Math.abs(e.width - t.getBoundingClientRect().width) > 0.1 ||
          Math.abs(e.height - t.getBoundingClientRect().height) > 0.1
        );
      };
      this.resizeObserver ||
        void 0 === window.ResizeObserver ||
        (this.resizeObserver = new ResizeObserver(() => {
          this.updateTimer ||
            (e()
              ? (this.onResize(),
                this.isMobile &&
                  (this.updateTimer = setTimeout(() => {
                    e() && this.onResize(), (this.updateTimer = null);
                  }, 500)))
              : this.updateTimer &&
                (clearTimeout(this.updateTimer), (this.updateTimer = null)));
        })),
        null === (t = this.resizeObserver) ||
          void 0 === t ||
          t.observe(this.container);
    }
    detachObserver() {
      var t;
      null === (t = this.resizeObserver) || void 0 === t || t.disconnect();
    }
    attachEvents() {
      const { container: t } = this;
      t.addEventListener("click", this.onClick, { passive: !1, capture: !1 }),
        t.addEventListener("wheel", this.onWheel, { passive: !1 }),
        (this.pointerTracker = new a(t, {
          start: this.onPointerDown,
          move: this.onPointerMove,
          end: this.onPointerUp,
        })),
        document.addEventListener(O, this.onMouseMove);
    }
    detachEvents() {
      var t;
      const { container: e } = this;
      e.removeEventListener("click", this.onClick, {
        passive: !1,
        capture: !1,
      }),
        e.removeEventListener("wheel", this.onWheel, { passive: !1 }),
        null === (t = this.pointerTracker) || void 0 === t || t.stop(),
        (this.pointerTracker = null),
        document.removeEventListener(O, this.onMouseMove),
        document.removeEventListener("keydown", this.onKeydown, !0),
        this.clickTimer &&
          (clearTimeout(this.clickTimer), (this.clickTimer = null)),
        this.updateTimer &&
          (clearTimeout(this.updateTimer), (this.updateTimer = null));
    }
    animate() {
      this.setTargetForce();
      const t = this.friction,
        e = this.option("maxVelocity");
      for (const i of m)
        t
          ? ((this.velocity[i] *= 1 - t),
            e &&
              !this.isScaling &&
              (this.velocity[i] = Math.max(
                Math.min(this.velocity[i], e),
                -1 * e
              )),
            (this.current[i] += this.velocity[i]))
          : (this.current[i] = this.target[i]);
      this.setTransform(),
        this.setEdgeForce(),
        !this.isResting || this.isDragging
          ? (this.rAF = requestAnimationFrame(() => this.animate()))
          : this.stop("current");
    }
    setTargetForce() {
      for (const t of m)
        ("e" === t && this.isBouncingX) ||
          ("f" === t && this.isBouncingY) ||
          (this.velocity[t] =
            (1 / (1 - this.friction) - 1) * (this.target[t] - this.current[t]));
    }
    checkBounds(t = 0, e = 0) {
      const { current: i } = this,
        n = i.e + t,
        s = i.f + e,
        o = this.getBounds(),
        { x: r, y: a } = o,
        h = r.min,
        c = r.max,
        l = a.min,
        u = a.max;
      let d = 0,
        g = 0;
      return (
        h !== 1 / 0 && n < h
          ? (d = h - n)
          : c !== 1 / 0 && n > c && (d = c - n),
        l !== 1 / 0 && s < l
          ? (g = l - s)
          : u !== 1 / 0 && s > u && (g = u - s),
        Math.abs(d) < 1e-4 && (d = 0),
        Math.abs(g) < 1e-4 && (g = 0),
        Object.assign(Object.assign({}, o), {
          xDiff: d,
          yDiff: g,
          inBounds: !d && !g,
        })
      );
    }
    clampTargetBounds() {
      const { target: t } = this,
        { x: e, y: i } = this.getBounds();
      e.min !== 1 / 0 && (t.e = Math.max(t.e, e.min)),
        e.max !== 1 / 0 && (t.e = Math.min(t.e, e.max)),
        i.min !== 1 / 0 && (t.f = Math.max(t.f, i.min)),
        i.max !== 1 / 0 && (t.f = Math.min(t.f, i.max));
    }
    calculateContentDim(t = this.current) {
      const { content: e, contentRect: i } = this,
        { fitWidth: n, fitHeight: s, fullWidth: o, fullHeight: r } = i;
      let a = o,
        h = r;
      if (this.option("zoom") || 0 !== this.angle) {
        const i =
            !(e instanceof HTMLImageElement) &&
            ("none" === window.getComputedStyle(e).maxWidth ||
              "none" === window.getComputedStyle(e).maxHeight),
          c = i ? o : n,
          l = i ? r : s,
          u = this.getMatrix(t),
          d = new DOMPoint(0, 0).matrixTransform(u),
          g = new DOMPoint(0 + c, 0).matrixTransform(u),
          f = new DOMPoint(0 + c, 0 + l).matrixTransform(u),
          m = new DOMPoint(0, 0 + l).matrixTransform(u),
          p = Math.abs(f.x - d.x),
          b = Math.abs(f.y - d.y),
          v = Math.abs(m.x - g.x),
          y = Math.abs(m.y - g.y);
        (a = Math.max(p, v)), (h = Math.max(b, y));
      }
      return { contentWidth: a, contentHeight: h };
    }
    setEdgeForce() {
      if (
        this.ignoreBounds ||
        this.isDragging ||
        this.panMode === O ||
        this.targetScale < this.scale
      )
        return (this.isBouncingX = !1), void (this.isBouncingY = !1);
      const { target: t } = this,
        { x: e, y: i, xDiff: n, yDiff: s } = this.checkBounds();
      const o = this.option("maxVelocity");
      let r = this.velocity.e,
        a = this.velocity.f;
      0 !== n
        ? ((this.isBouncingX = !0),
          n * r <= 0
            ? (r += 0.14 * n)
            : ((r = 0.14 * n),
              e.min !== 1 / 0 && (this.target.e = Math.max(t.e, e.min)),
              e.max !== 1 / 0 && (this.target.e = Math.min(t.e, e.max))),
          o && (r = Math.max(Math.min(r, o), -1 * o)))
        : (this.isBouncingX = !1),
        0 !== s
          ? ((this.isBouncingY = !0),
            s * a <= 0
              ? (a += 0.14 * s)
              : ((a = 0.14 * s),
                i.min !== 1 / 0 && (this.target.f = Math.max(t.f, i.min)),
                i.max !== 1 / 0 && (this.target.f = Math.min(t.f, i.max))),
            o && (a = Math.max(Math.min(a, o), -1 * o)))
          : (this.isBouncingY = !1),
        this.isBouncingX && (this.velocity.e = r),
        this.isBouncingY && (this.velocity.f = a);
    }
    enable() {
      const { content: t } = this,
        e = new DOMMatrixReadOnly(window.getComputedStyle(t).transform);
      for (const t of m) this.current[t] = this.target[t] = e[t];
      this.updateMetrics(),
        this.attachObserver(),
        this.attachEvents(),
        (this.state = f.Ready),
        this.emit("ready");
    }
    onClick(t) {
      var e;
      "click" === t.type &&
        0 === t.detail &&
        ((this.dragOffset.x = 0), (this.dragOffset.y = 0)),
        this.isDragging &&
          (null === (e = this.pointerTracker) || void 0 === e || e.clear(),
          (this.trackingPoints = []),
          this.startDecelAnim());
      const i = t.target;
      if (!i || t.defaultPrevented) return;
      if (i.hasAttribute("disabled"))
        return t.preventDefault(), void t.stopPropagation();
      if (
        (() => {
          const t = window.getSelection();
          return t && "Range" === t.type;
        })() &&
        !i.closest("button")
      )
        return;
      const n = i.closest("[data-panzoom-action]"),
        s = i.closest("[data-panzoom-change]"),
        o = n || s,
        r =
          o && (a = o) && null !== a && a instanceof Element && "nodeType" in a
            ? o.dataset
            : null;
      var a;
      if (r) {
        const e = r.panzoomChange,
          i = r.panzoomAction;
        if (((e || i) && t.preventDefault(), e)) {
          let t = {};
          try {
            t = JSON.parse(e);
          } catch (t) {
            console && console.warn("The given data was not valid JSON");
          }
          return void this.applyChange(t);
        }
        if (i) return void (this[i] && this[i]());
      }
      if (Math.abs(this.dragOffset.x) > 3 || Math.abs(this.dragOffset.y) > 3)
        return t.preventDefault(), void t.stopPropagation();
      if (i.closest("[data-fancybox]")) return;
      const h = this.content.getBoundingClientRect(),
        c = this.dragStart;
      if (
        c.time &&
        !this.canZoomOut() &&
        (Math.abs(h.x - c.x) > 2 || Math.abs(h.y - c.y) > 2)
      )
        return;
      this.dragStart.time = 0;
      const l = (e) => {
          this.option("zoom", t) &&
            e &&
            "string" == typeof e &&
            /(iterateZoom)|(toggle(Zoom|Full|Cover|Max)|(zoomTo(Fit|Cover|Max)))/.test(
              e
            ) &&
            "function" == typeof this[e] &&
            (t.preventDefault(), this[e]({ event: t }));
        },
        u = this.option("click", t),
        d = this.option("dblClick", t);
      d
        ? (this.clicks++,
          1 == this.clicks &&
            (this.clickTimer = setTimeout(() => {
              1 === this.clicks
                ? (this.emit("click", t), !t.defaultPrevented && u && l(u))
                : (this.emit("dblClick", t), t.defaultPrevented || l(d)),
                (this.clicks = 0),
                (this.clickTimer = null);
            }, 350)))
        : (this.emit("click", t), !t.defaultPrevented && u && l(u));
    }
    addTrackingPoint(t) {
      const e = this.trackingPoints.filter((t) => t.time > Date.now() - 100);
      e.push(t), (this.trackingPoints = e);
    }
    onPointerDown(t, e, i) {
      var n;
      if (!1 === this.option("touch", t)) return !1;
      (this.pwt = 0),
        (this.dragOffset = { x: 0, y: 0, time: 0 }),
        (this.trackingPoints = []);
      const s = this.content.getBoundingClientRect();
      if (
        ((this.dragStart = {
          x: s.x,
          y: s.y,
          top: s.top,
          left: s.left,
          time: Date.now(),
        }),
        this.clickTimer)
      )
        return !1;
      if (this.panMode === O && this.targetScale > 1)
        return t.preventDefault(), t.stopPropagation(), !1;
      const o = t.composedPath()[0];
      if (!i.length) {
        if (
          ["TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO", "IFRAME"].includes(
            o.nodeName
          ) ||
          o.closest(
            "[contenteditable],[data-selectable],[data-draggable],[data-clickable],[data-panzoom-change],[data-panzoom-action]"
          )
        )
          return !1;
        null === (n = window.getSelection()) ||
          void 0 === n ||
          n.removeAllRanges();
      }
      if ("mousedown" === t.type)
        ["A", "BUTTON"].includes(o.nodeName) || t.preventDefault();
      else if (Math.abs(this.velocity.a) > 0.3) return !1;
      return (
        (this.target.e = this.current.e),
        (this.target.f = this.current.f),
        this.stop(),
        this.isDragging ||
          ((this.isDragging = !0),
          this.addTrackingPoint(e),
          this.emit("touchStart", t)),
        !0
      );
    }
    onPointerMove(t, n, s) {
      if (!1 === this.option("touch", t)) return;
      if (!this.isDragging) return;
      if (
        n.length < 2 &&
        this.panOnlyZoomed &&
        e(this.targetScale) <= e(this.minScale)
      )
        return;
      if ((this.emit("touchMove", t), t.defaultPrevented)) return;
      this.addTrackingPoint(n[0]);
      const { content: o } = this,
        r = c(s[0], s[1]),
        a = c(n[0], n[1]);
      let l = 0,
        u = 0;
      if (n.length > 1) {
        const t = o.getBoundingClientRect();
        (l = r.clientX - t.left - 0.5 * t.width),
          (u = r.clientY - t.top - 0.5 * t.height);
      }
      const d = h(s[0], s[1]),
        g = h(n[0], n[1]);
      let f = d ? g / d : 1,
        m = a.clientX - r.clientX,
        p = a.clientY - r.clientY;
      (this.dragOffset.x += m),
        (this.dragOffset.y += p),
        (this.dragOffset.time = Date.now() - this.dragStart.time);
      let b =
        e(this.targetScale) === e(this.minScale) && this.option("lockAxis");
      if (b && !this.lockedAxis)
        if ("xy" === b || "y" === b || "touchmove" === t.type) {
          if (
            Math.abs(this.dragOffset.x) < 6 &&
            Math.abs(this.dragOffset.y) < 6
          )
            return void t.preventDefault();
          const e = Math.abs(
            (180 * Math.atan2(this.dragOffset.y, this.dragOffset.x)) / Math.PI
          );
          (this.lockedAxis = e > 45 && e < 135 ? "y" : "x"),
            (this.dragOffset.x = 0),
            (this.dragOffset.y = 0),
            (m = 0),
            (p = 0);
        } else this.lockedAxis = b;
      if (
        (i(t.target, this.content) && ((b = "x"), (this.dragOffset.y = 0)),
        b &&
          "xy" !== b &&
          this.lockedAxis !== b &&
          e(this.targetScale) === e(this.minScale))
      )
        return;
      t.cancelable && t.preventDefault(),
        this.container.classList.add(this.cn("isDragging"));
      const v = this.checkBounds(m, p);
      this.option("rubberband")
        ? ("x" !== this.isInfinite &&
            ((v.xDiff > 0 && m < 0) || (v.xDiff < 0 && m > 0)) &&
            (m *= Math.max(
              0,
              0.5 - Math.abs((0.75 / this.contentRect.fitWidth) * v.xDiff)
            )),
          "y" !== this.isInfinite &&
            ((v.yDiff > 0 && p < 0) || (v.yDiff < 0 && p > 0)) &&
            (p *= Math.max(
              0,
              0.5 - Math.abs((0.75 / this.contentRect.fitHeight) * v.yDiff)
            )))
        : (v.xDiff && (m = 0), v.yDiff && (p = 0));
      const y = this.targetScale,
        w = this.minScale,
        M = this.maxScale;
      y < 0.5 * w && (f = Math.max(f, w)),
        y > 1.5 * M && (f = Math.min(f, M)),
        "y" === this.lockedAxis && e(y) === e(w) && (m = 0),
        "x" === this.lockedAxis && e(y) === e(w) && (p = 0),
        this.applyChange({
          originX: l,
          originY: u,
          panX: m,
          panY: p,
          scale: f,
          friction: this.option("dragFriction"),
          ignoreBounds: !0,
        });
    }
    onPointerUp(t, e, n) {
      if (n.length)
        return (
          (this.dragOffset.x = 0),
          (this.dragOffset.y = 0),
          void (this.trackingPoints = [])
        );
      this.container.classList.remove(this.cn("isDragging")),
        this.isDragging &&
          (this.addTrackingPoint(e),
          this.panOnlyZoomed &&
            this.contentRect.width - this.contentRect.fitWidth < 1 &&
            this.contentRect.height - this.contentRect.fitHeight < 1 &&
            (this.trackingPoints = []),
          i(t.target, this.content) &&
            "y" === this.lockedAxis &&
            (this.trackingPoints = []),
          this.emit("touchEnd", t),
          (this.isDragging = !1),
          (this.lockedAxis = !1),
          this.state !== f.Destroy &&
            (t.defaultPrevented || this.startDecelAnim()));
    }
    startDecelAnim() {
      var t;
      const i = this.isScaling;
      this.rAF && (cancelAnimationFrame(this.rAF), (this.rAF = null)),
        (this.isBouncingX = !1),
        (this.isBouncingY = !1);
      for (const t of m) this.velocity[t] = 0;
      (this.target.e = this.current.e),
        (this.target.f = this.current.f),
        y(this.container, "is-scaling"),
        y(this.container, "is-animating"),
        (this.isTicking = !1);
      const { trackingPoints: n } = this,
        s = n[0],
        o = n[n.length - 1];
      let r = 0,
        a = 0,
        h = 0;
      o &&
        s &&
        ((r = o.clientX - s.clientX),
        (a = o.clientY - s.clientY),
        (h = o.time - s.time));
      const c =
        (null === (t = window.visualViewport) || void 0 === t
          ? void 0
          : t.scale) || 1;
      1 !== c && ((r *= c), (a *= c));
      let l = 0,
        u = 0,
        d = 0,
        g = 0,
        f = this.option("decelFriction");
      const p = this.targetScale;
      if (h > 0) {
        (d = Math.abs(r) > 3 ? r / (h / 30) : 0),
          (g = Math.abs(a) > 3 ? a / (h / 30) : 0);
        const t = this.option("maxVelocity");
        t &&
          ((d = Math.max(Math.min(d, t), -1 * t)),
          (g = Math.max(Math.min(g, t), -1 * t)));
      }
      d && (l = d / (1 / (1 - f) - 1)),
        g && (u = g / (1 / (1 - f) - 1)),
        ("y" === this.option("lockAxis") ||
          ("xy" === this.option("lockAxis") &&
            "y" === this.lockedAxis &&
            e(p) === this.minScale)) &&
          (l = d = 0),
        ("x" === this.option("lockAxis") ||
          ("xy" === this.option("lockAxis") &&
            "x" === this.lockedAxis &&
            e(p) === this.minScale)) &&
          (u = g = 0);
      const b = this.dragOffset.x,
        v = this.dragOffset.y,
        w = this.option("dragMinThreshold") || 0;
      Math.abs(b) < w && Math.abs(v) < w && ((l = u = 0), (d = g = 0)),
        ((this.option("zoom") &&
          (p < this.minScale - 1e-5 || p > this.maxScale + 1e-5)) ||
          (i && !l && !u)) &&
          (f = 0.35),
        this.applyChange({ panX: l, panY: u, friction: f }),
        this.emit("decel", d, g, b, v);
    }
    onWheel(t) {
      var e = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce(function (
        t,
        e
      ) {
        return Math.abs(e) > Math.abs(t) ? e : t;
      });
      const i = Math.max(-1, Math.min(1, e));
      if ((this.emit("wheel", t, i), this.panMode === O)) return;
      if (t.defaultPrevented) return;
      const n = this.option("wheel");
      "pan" === n
        ? (t.preventDefault(),
          (this.panOnlyZoomed && !this.canZoomOut()) ||
            this.applyChange({
              panX: 2 * -t.deltaX,
              panY: 2 * -t.deltaY,
              bounce: !1,
            }))
        : "zoom" === n && !1 !== this.option("zoom") && this.zoomWithWheel(t);
    }
    onMouseMove(t) {
      this.panWithMouse(t);
    }
    onKeydown(t) {
      "Escape" === t.key && this.toggleFS();
    }
    onResize() {
      this.updateMetrics(), this.checkBounds().inBounds || this.requestTick();
    }
    setTransform() {
      this.emit("beforeTransform");
      const { current: t, target: i, content: n, contentRect: s } = this,
        o = Object.assign({}, M);
      for (const n of m) {
        const s = "e" == n || "f" === n ? x : P;
        (o[n] = e(t[n], s)),
          Math.abs(i[n] - t[n]) < ("e" == n || "f" === n ? 0.51 : 0.001) &&
            (t[n] = i[n]);
      }
      let { a: r, b: a, c: h, d: c, e: l, f: u } = o,
        d = `matrix(${r}, ${a}, ${h}, ${c}, ${l}, ${u})`,
        g = n.parentElement instanceof HTMLPictureElement ? n.parentElement : n;
      if (
        (this.option("transformParent") && (g = g.parentElement || g),
        g.style.transform === d)
      )
        return;
      g.style.transform = d;
      const { contentWidth: f, contentHeight: p } = this.calculateContentDim();
      (s.width = f), (s.height = p), this.emit("afterTransform");
    }
    updateMetrics(t = !1) {
      var i;
      if (!this || this.state === f.Destroy) return;
      if (this.isContentLoading) return;
      const n = Math.max(
          1,
          (null === (i = window.visualViewport) || void 0 === i
            ? void 0
            : i.scale) || 1
        ),
        { container: s, content: o } = this,
        r = o instanceof HTMLImageElement,
        a = s.getBoundingClientRect(),
        h = getComputedStyle(this.container);
      let c = a.width * n,
        l = a.height * n;
      const u = parseFloat(h.paddingTop) + parseFloat(h.paddingBottom),
        d = c - (parseFloat(h.paddingLeft) + parseFloat(h.paddingRight)),
        g = l - u;
      this.containerRect = {
        width: c,
        height: l,
        innerWidth: d,
        innerHeight: g,
      };
      const m =
          parseFloat(o.dataset.width || "") ||
          ((t) => {
            let e = 0;
            return (
              (e =
                t instanceof HTMLImageElement
                  ? t.naturalWidth
                  : t instanceof SVGElement
                  ? t.width.baseVal.value
                  : Math.max(t.offsetWidth, t.scrollWidth)),
              e || 0
            );
          })(o),
        p =
          parseFloat(o.dataset.height || "") ||
          ((t) => {
            let e = 0;
            return (
              (e =
                t instanceof HTMLImageElement
                  ? t.naturalHeight
                  : t instanceof SVGElement
                  ? t.height.baseVal.value
                  : Math.max(t.offsetHeight, t.scrollHeight)),
              e || 0
            );
          })(o);
      let b = this.option("width", m) || E,
        v = this.option("height", p) || E;
      const y = b === E,
        w = v === E;
      "number" != typeof b && (b = m),
        "number" != typeof v && (v = p),
        y && (b = m * (v / p)),
        w && (v = p / (m / b));
      let M =
        o.parentElement instanceof HTMLPictureElement ? o.parentElement : o;
      this.option("transformParent") && (M = M.parentElement || M);
      const P = M.getAttribute("style") || "";
      M.style.setProperty("transform", "none", "important"),
        r && ((M.style.width = ""), (M.style.height = "")),
        M.offsetHeight;
      const x = o.getBoundingClientRect();
      let O = x.width * n,
        T = x.height * n,
        S = O,
        k = T;
      (O = Math.min(O, b)),
        (T = Math.min(T, v)),
        r
          ? ({ width: O, height: T } = ((t, e, i, n) => {
              const s = i / t,
                o = n / e,
                r = Math.min(s, o);
              return { width: (t *= r), height: (e *= r) };
            })(b, v, O, T))
          : ((O = Math.min(O, b)), (T = Math.min(T, v)));
      let C = 0.5 * (k - T),
        A = 0.5 * (S - O);
      (this.contentRect = Object.assign(Object.assign({}, this.contentRect), {
        top: x.top - a.top + C,
        bottom: a.bottom - x.bottom + C,
        left: x.left - a.left + A,
        right: a.right - x.right + A,
        fitWidth: O,
        fitHeight: T,
        width: O,
        height: T,
        fullWidth: b,
        fullHeight: v,
      })),
        (M.style.cssText = P),
        r && ((M.style.width = `${O}px`), (M.style.height = `${T}px`)),
        this.setTransform(),
        !0 !== t && this.emit("refresh"),
        this.ignoreBounds ||
          (e(this.targetScale) < e(this.minScale)
            ? this.zoomTo(this.minScale, { friction: 0 })
            : this.targetScale > this.maxScale
            ? this.zoomTo(this.maxScale, { friction: 0 })
            : this.state === f.Init ||
              this.checkBounds().inBounds ||
              this.requestTick()),
        this.updateControls();
    }
    calculateBounds() {
      const { contentWidth: t, contentHeight: i } = this.calculateContentDim(
          this.target
        ),
        { targetScale: n, lockedAxis: s } = this,
        { fitWidth: o, fitHeight: r } = this.contentRect;
      let a = 0,
        h = 0,
        c = 0,
        l = 0;
      const u = this.option("infinite");
      if (!0 === u || (s && u === s))
        (a = -1 / 0), (c = 1 / 0), (h = -1 / 0), (l = 1 / 0);
      else {
        let { containerRect: s, contentRect: u } = this,
          d = e(o * n, x),
          g = e(r * n, x),
          { innerWidth: f, innerHeight: m } = s;
        if (
          (s.width === d && (f = s.width),
          s.width === g && (m = s.height),
          t > f)
        ) {
          (c = 0.5 * (t - f)), (a = -1 * c);
          let e = 0.5 * (u.right - u.left);
          (a += e), (c += e);
        }
        if (
          (o > f && t < f && ((a -= 0.5 * (o - f)), (c -= 0.5 * (o - f))),
          i > m)
        ) {
          (l = 0.5 * (i - m)), (h = -1 * l);
          let t = 0.5 * (u.bottom - u.top);
          (h += t), (l += t);
        }
        r > m && i < m && ((a -= 0.5 * (r - m)), (c -= 0.5 * (r - m)));
      }
      return { x: { min: a, max: c }, y: { min: h, max: l } };
    }
    getBounds() {
      const t = this.option("bounds");
      return t !== E ? t : this.calculateBounds();
    }
    updateControls() {
      const t = this,
        i = t.container,
        { panMode: n, contentRect: o, targetScale: r, minScale: a } = t;
      let h = a,
        c = t.option("click") || !1;
      c && (h = t.getNextScale(c));
      let l = t.canZoomIn(),
        u = t.canZoomOut(),
        d = n === T && !!this.option("touch"),
        g = u && d;
      if (
        (d &&
          (e(r) < e(a) && !this.panOnlyZoomed && (g = !0),
          (e(o.width, 1) > e(o.fitWidth, 1) ||
            e(o.height, 1) > e(o.fitHeight, 1)) &&
            (g = !0)),
        e(o.width * r, 1) < e(o.fitWidth, 1) && (g = !1),
        n === O && (g = !1),
        s(i, this.cn("isDraggable"), g),
        !this.option("zoom"))
      )
        return;
      let f = l && e(h) > e(r),
        m = !f && !g && u && e(h) < e(r);
      s(i, this.cn("canZoomIn"), f), s(i, this.cn("canZoomOut"), m);
      for (const t of i.querySelectorAll("[data-panzoom-action]")) {
        let e = !1,
          i = !1;
        switch (t.dataset.panzoomAction) {
          case "zoomIn":
            l ? (e = !0) : (i = !0);
            break;
          case "zoomOut":
            u ? (e = !0) : (i = !0);
            break;
          case "toggleZoom":
          case "iterateZoom":
            l || u ? (e = !0) : (i = !0);
            const n = t.querySelector("g");
            n && (n.style.display = l ? "" : "none");
        }
        e
          ? (t.removeAttribute("disabled"), t.removeAttribute("tabindex"))
          : i &&
            (t.setAttribute("disabled", ""), t.setAttribute("tabindex", "-1"));
      }
    }
    panTo({
      x: t = this.target.e,
      y: e = this.target.f,
      scale: i = this.targetScale,
      friction: n = this.option("friction"),
      angle: s = 0,
      originX: o = 0,
      originY: r = 0,
      flipX: a = !1,
      flipY: h = !1,
      ignoreBounds: c = !1,
    }) {
      this.state !== f.Destroy &&
        this.applyChange({
          panX: t - this.target.e,
          panY: e - this.target.f,
          scale: i / this.targetScale,
          angle: s,
          originX: o,
          originY: r,
          friction: n,
          flipX: a,
          flipY: h,
          ignoreBounds: c,
        });
    }
    applyChange({
      panX: t = 0,
      panY: i = 0,
      scale: n = 1,
      angle: s = 0,
      originX: o = -this.current.e,
      originY: r = -this.current.f,
      friction: a = this.option("friction"),
      flipX: h = !1,
      flipY: c = !1,
      ignoreBounds: l = !1,
      bounce: u = this.option("bounce"),
    }) {
      const d = this.state;
      if (d === f.Destroy) return;
      this.rAF && (cancelAnimationFrame(this.rAF), (this.rAF = null)),
        (this.friction = a || 0),
        (this.ignoreBounds = l);
      const { current: g } = this,
        p = g.e,
        b = g.f,
        v = this.getMatrix(this.target);
      let y = new DOMMatrix().translate(p, b).translate(o, r).translate(t, i);
      if (this.option("zoom")) {
        if (!l) {
          const t = this.targetScale,
            e = this.minScale,
            i = this.maxScale;
          t * n < e && (n = e / t), t * n > i && (n = i / t);
        }
        y = y.scale(n);
      }
      (y = y.translate(-o, -r).translate(-p, -b).multiply(v)),
        s && (y = y.rotate(s)),
        h && (y = y.scale(-1, 1)),
        c && (y = y.scale(1, -1));
      for (const t of m)
        "e" !== t &&
        "f" !== t &&
        (y[t] > this.minScale + 1e-5 || y[t] < this.minScale - 1e-5)
          ? (this.target[t] = y[t])
          : (this.target[t] = e(y[t], x));
      (this.targetScale < this.scale ||
        Math.abs(n - 1) > 0.1 ||
        this.panMode === O ||
        !1 === u) &&
        !l &&
        this.clampTargetBounds(),
        d === f.Init
          ? this.animate()
          : this.isResting || ((this.state = f.Panning), this.requestTick());
    }
    stop(t = !1) {
      if (this.state === f.Init || this.state === f.Destroy) return;
      const e = this.isTicking;
      this.rAF && (cancelAnimationFrame(this.rAF), (this.rAF = null)),
        (this.isBouncingX = !1),
        (this.isBouncingY = !1);
      for (const e of m)
        (this.velocity[e] = 0),
          "current" === t
            ? (this.current[e] = this.target[e])
            : "target" === t && (this.target[e] = this.current[e]);
      this.setTransform(),
        y(this.container, "is-scaling"),
        y(this.container, "is-animating"),
        (this.isTicking = !1),
        (this.state = f.Ready),
        e && (this.emit("endAnimation"), this.updateControls());
    }
    requestTick() {
      this.isTicking ||
        (this.emit("startAnimation"),
        this.updateControls(),
        w(this.container, "is-animating"),
        this.isScaling && w(this.container, "is-scaling")),
        (this.isTicking = !0),
        this.rAF || (this.rAF = requestAnimationFrame(() => this.animate()));
    }
    panWithMouse(t, i = this.option("mouseMoveFriction")) {
      if (((this.pmme = t), this.panMode !== O || !t)) return;
      if (e(this.targetScale) <= e(this.minScale)) return;
      this.emit("mouseMove", t);
      const { container: n, containerRect: s, contentRect: o } = this,
        r = s.width,
        a = s.height,
        h = n.getBoundingClientRect(),
        c = (t.clientX || 0) - h.left,
        l = (t.clientY || 0) - h.top;
      let { contentWidth: u, contentHeight: d } = this.calculateContentDim(
        this.target
      );
      const g = this.option("mouseMoveFactor");
      g > 1 && (u !== r && (u *= g), d !== a && (d *= g));
      let f = 0.5 * (u - r) - (((c / r) * 100) / 100) * (u - r);
      f += 0.5 * (o.right - o.left);
      let m = 0.5 * (d - a) - (((l / a) * 100) / 100) * (d - a);
      (m += 0.5 * (o.bottom - o.top)),
        this.applyChange({
          panX: f - this.target.e,
          panY: m - this.target.f,
          friction: i,
        });
    }
    zoomWithWheel(t) {
      if (this.state === f.Destroy || this.state === f.Init) return;
      const i = Date.now();
      if (i - this.pwt < 45) return void t.preventDefault();
      this.pwt = i;
      var n = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce(function (
        t,
        e
      ) {
        return Math.abs(e) > Math.abs(t) ? e : t;
      });
      const s = Math.max(-1, Math.min(1, n)),
        { targetScale: o, maxScale: r, minScale: a } = this;
      let h = (o * (100 + 45 * s)) / 100;
      e(h) < e(a) && e(o) <= e(a)
        ? ((this.cwd += Math.abs(s)), (h = a))
        : e(h) > e(r) && e(o) >= e(r)
        ? ((this.cwd += Math.abs(s)), (h = r))
        : ((this.cwd = 0), (h = Math.max(Math.min(h, r), a))),
        this.cwd > this.option("wheelLimit") ||
          (t.preventDefault(), e(h) !== e(o) && this.zoomTo(h, { event: t }));
    }
    canZoomIn() {
      return (
        this.option("zoom") &&
        (e(this.contentRect.width, 1) < e(this.contentRect.fitWidth, 1) ||
          e(this.targetScale) < e(this.maxScale))
      );
    }
    canZoomOut() {
      return this.option("zoom") && e(this.targetScale) > e(this.minScale);
    }
    zoomIn(t = 1.25, e) {
      this.zoomTo(this.targetScale * t, e);
    }
    zoomOut(t = 0.8, e) {
      this.zoomTo(this.targetScale * t, e);
    }
    zoomToFit(t) {
      this.zoomTo("fit", t);
    }
    zoomToCover(t) {
      this.zoomTo("cover", t);
    }
    zoomToFull(t) {
      this.zoomTo("full", t);
    }
    zoomToMax(t) {
      this.zoomTo("max", t);
    }
    toggleZoom(t) {
      this.zoomTo(this.getNextScale("toggleZoom"), t);
    }
    toggleMax(t) {
      this.zoomTo(this.getNextScale("toggleMax"), t);
    }
    toggleCover(t) {
      this.zoomTo(this.getNextScale("toggleCover"), t);
    }
    iterateZoom(t) {
      this.zoomTo("next", t);
    }
    zoomTo(
      t = 1,
      { friction: e = E, originX: i = E, originY: n = E, event: s } = {}
    ) {
      if (this.isContentLoading || this.state === f.Destroy) return;
      const { targetScale: o, fullScale: r, maxScale: a, coverScale: h } = this;
      if (
        (this.stop(),
        this.panMode === O && (s = this.pmme || s),
        s || i === E || n === E)
      ) {
        const t = this.content.getBoundingClientRect(),
          e = this.container.getBoundingClientRect(),
          o = s ? s.clientX : e.left + 0.5 * e.width,
          r = s ? s.clientY : e.top + 0.5 * e.height;
        (i = o - t.left - 0.5 * t.width), (n = r - t.top - 0.5 * t.height);
      }
      let c = 1;
      "number" == typeof t
        ? (c = t)
        : "full" === t
        ? (c = r)
        : "cover" === t
        ? (c = h)
        : "max" === t
        ? (c = a)
        : "fit" === t
        ? (c = 1)
        : "next" === t && (c = this.getNextScale("iterateZoom")),
        (c = c / o || 1),
        (e = e === E ? (c > 1 ? 0.15 : 0.25) : e),
        this.applyChange({ scale: c, originX: i, originY: n, friction: e }),
        s && this.panMode === O && this.panWithMouse(s, e);
    }
    rotateCCW() {
      this.applyChange({ angle: -90 });
    }
    rotateCW() {
      this.applyChange({ angle: 90 });
    }
    flipX() {
      this.applyChange({ flipX: !0 });
    }
    flipY() {
      this.applyChange({ flipY: !0 });
    }
    fitX() {
      this.stop("target");
      const { containerRect: t, contentRect: e, target: i } = this;
      this.applyChange({
        panX: 0.5 * t.width - (e.left + 0.5 * e.fitWidth) - i.e,
        panY: 0.5 * t.height - (e.top + 0.5 * e.fitHeight) - i.f,
        scale: t.width / e.fitWidth / this.targetScale,
        originX: 0,
        originY: 0,
        ignoreBounds: !0,
      });
    }
    fitY() {
      this.stop("target");
      const { containerRect: t, contentRect: e, target: i } = this;
      this.applyChange({
        panX: 0.5 * t.width - (e.left + 0.5 * e.fitWidth) - i.e,
        panY: 0.5 * t.innerHeight - (e.top + 0.5 * e.fitHeight) - i.f,
        scale: t.height / e.fitHeight / this.targetScale,
        originX: 0,
        originY: 0,
        ignoreBounds: !0,
      });
    }
    toggleFS() {
      const { container: t } = this,
        e = this.cn("inFullscreen"),
        i = this.cn("htmlHasFullscreen");
      t.classList.toggle(e);
      const n = t.classList.contains(e);
      n
        ? (document.documentElement.classList.add(i),
          document.addEventListener("keydown", this.onKeydown, !0))
        : (document.documentElement.classList.remove(i),
          document.removeEventListener("keydown", this.onKeydown, !0)),
        this.updateMetrics(),
        this.emit(n ? "enterFS" : "exitFS");
    }
    getMatrix(t = this.current) {
      const { a: e, b: i, c: n, d: s, e: o, f: r } = t;
      return new DOMMatrix([e, i, n, s, o, r]);
    }
    reset(t) {
      if (this.state !== f.Init && this.state !== f.Destroy) {
        this.stop("current");
        for (const t of m) this.target[t] = M[t];
        (this.target.a = this.minScale),
          (this.target.d = this.minScale),
          this.clampTargetBounds(),
          this.isResting ||
            ((this.friction = void 0 === t ? this.option("friction") : t),
            (this.state = f.Panning),
            this.requestTick());
      }
    }
    destroy() {
      this.stop(),
        (this.state = f.Destroy),
        this.detachEvents(),
        this.detachObserver();
      const { container: t, content: e } = this,
        i = this.option("classes") || {};
      for (const e of Object.values(i)) t.classList.remove(e + "");
      e &&
        (e.removeEventListener("load", this.onLoad),
        e.removeEventListener("error", this.onError)),
        this.detachPlugins();
    }
  }
  Object.defineProperty(A, "defaults", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: p,
  }),
    Object.defineProperty(A, "Plugins", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: {},
    }),
    (t.Panzoom = A);
});
