/* tslint:disable */
var __decorate =
    (this && this.__decorate) ||
    function(d, e, k, l) {
      var b = arguments.length,
        a = 3 > b ? e : null === l ? (l = Object.getOwnPropertyDescriptor(e, k)) : l,
        f;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) a = Reflect.decorate(d, e, k, l);
      else
        for (var c = d.length - 1; 0 <= c; c--) if ((f = d[c])) a = (3 > b ? f(a) : 3 < b ? f(e, k, a) : f(e, k)) || a;
      return 3 < b && a && Object.defineProperty(e, k, a), a;
    },
  __extends =
    (this && this.__extends) ||
    function(d, e) {
      function k() {
        this.constructor = d;
      }
      for (var l in e) e.hasOwnProperty(l) && (d[l] = e[l]);
      k.prototype = e.prototype;
      d.prototype = new k();
    },
  IPMI;
(function(d) {
  var e = (function() {
    return function(b, a) {
      void 0 === b && (b = 0);
      void 0 === a && (a = 0);
      this.x = b;
      this.y = a;
    };
  })();
  d.Vec2 = e;
  e = (function(b) {
    function a(a, c) {
      void 0 === a && (a = 0);
      void 0 === c && (c = 0);
      b.call(this, a, c);
    }
    __extends(a, b);
    return a;
  })(d.Vec2);
  d.Point2 = e;
  e = (function() {
    return function(b, a, f, c) {
      void 0 === b && (b = 0);
      void 0 === a && (a = 0);
      void 0 === f && (f = 0);
      void 0 === c && (c = 0);
      this.x = b;
      this.y = a;
      this.width = f;
      this.height = c;
    };
  })();
  d.BoundingBox = e;
  var k = (function() {
    function b(a, f, c, b, d) {
      void 0 === b && (b = !1);
      void 0 === d && (d = 0);
      this.context = this.listener = this.signal = null;
      this.isOnce = !1;
      this.priority = 0;
      this.active = !0;
      this.signal = a;
      this.listener = f;
      this.context = c;
      this.isOnce = b;
      this.priority = d;
    }
    b.prototype.execute = function(a) {
      var f;
      this.active && this.listener && ((f = this.listener.apply(this.context, a)), this.isOnce && this.detach());
      return f;
    };
    b.prototype.detach = function() {
      this.signal.remove(this.listener, this.context);
    };
    b.prototype.destroy = function() {
      this.context = this.listener = this.signal = null;
    };
    return b;
  })();
  d.SignalBinding = k;
  e = (function() {
    function b(a) {
      this.name = null;
      this.bindings = [];
      this.name = a;
    }
    b.prototype.addBinding = function(a) {
      this.bindings.push(a);
      this.bindings.sort(function(a, c) {
        return a.priority > c.priority ? 1 : c.priority < a.priority ? -1 : 0;
      });
    };
    b.prototype.validateListener = function(a, f) {
      "function" !== typeof a &&
        (d.Tools.Error("Listener is a required argument of " + f + " and should be a Function."), (a = function() {}));
      return a;
    };
    b.prototype.indexOfListener = function(a, f) {
      for (var c = this.bindings.length, b; c--; )
        if (((b = this.bindings[c]), b.listener === a && b.context === f)) return c;
      return -1;
    };
    b.prototype.has = function(a, f) {
      void 0 === f && (f = null);
      return -1 !== this.indexOfListener(a, f);
    };
    b.prototype.add = function(a, f, c) {
      void 0 === f && (f = null);
      void 0 === c && (c = 0);
      a = new k(this, this.validateListener(a, "add"), f, !1, c);
      this.addBinding(a);
      return this;
    };
    b.prototype.addOnce = function(a, f, c) {
      void 0 === f && (f = null);
      void 0 === c && (c = 0);
      a = new k(this, this.validateListener(a, "add"), f, !0, c);
      this.addBinding(a);
      return this;
    };
    b.prototype.remove = function(a, f) {
      var c = this.indexOfListener(a, f);
      -1 !== c && (this.bindings[c].destroy(), this.bindings.splice(c, 1));
      return this;
    };
    b.prototype.removeAll = function() {
      for (var a = this.bindings.length; a--; ) this.bindings[a].destroy();
      this.bindings.length = 0;
      return this;
    };
    b.prototype.dispatch = function() {
      for (var a = [], f = 0; f < arguments.length; f++) a[f - 0] = arguments[f];
      var f = this.bindings.slice(),
        c = f.length;
      do c--;
      while (f[c] && !1 !== f[c].execute(a));
      return this;
    };
    b.prototype.dispose = function() {
      this.removeAll();
      this.bindings = [];
    };
    return b;
  })();
  d.Signal = e;
  e = (function() {
    function b(a, f, c, b) {
      void 0 === a && (a = "localhost");
      void 0 === f && (f = 7681);
      void 0 === c && (c = "");
      void 0 === b && (b = { autoreconnect: !0 });
      this.connected = !1;
      this.retries = 0;
      this.ConnectionOpenedSignal = new d.Signal("ConnectionOpened");
      this.ConnectionClosedSignal = new d.Signal("ConnectionClosed");
      this.DisconnectSignal = new d.Signal("Disconnect");
      this.MessageReceivedSignal = new d.Signal("MessageReceived");
      this.SendMessageSignal = new d.Signal("SendMessage");
      d.Tools.LogGroup("Starting WebSocket connection");
      this.hostaddr = a;
      this.hostport = f;
      this.hostpath = c;
      this.options = b;
      this.connect();
      this.DisconnectSignal.add(this.onDisconnect, this);
      this.SendMessageSignal.add(this.onSendMessage, this);
      d.Tools.LogGroupEnd();
    }
    b.prototype.connect = function() {
      this.connection = new WebSocket("ws://" + this.hostaddr + ":" + this.hostport.toString() + (this.hostpath || ""));
      this.connection.onmessage = this.onMessageReceived.bind(this);
      this.connection.onopen = this.onConnectionOpened.bind(this);
      this.connection.onclose = this.onConnectionClosed.bind(this);
      d.Tools.Inform("WebSocket initialized");
    };
    b.prototype.send = function(a) {
      a = a instanceof Object ? JSON.stringify(a) : a;
      this.connection.send(a);
    };
    b.prototype.onConnectionOpened = function(a) {
      d.Tools.Inform("WebSocket connection opened");
      this.connected = !0;
      this.retries = 0;
      this.ConnectionOpenedSignal.dispatch();
    };
    b.prototype.onConnectionClosed = function(a) {
      var f = this;
      this.connected
        ? d.Tools.Warn("WebSocket connection lost")
        : d.Tools.Warn("Unable to establish WebSocket connection");
      this.connected = !1;
      this.ConnectionClosedSignal.dispatch();
      this.options.autoreconnect &&
        (this.retries++,
        5 < this.retries
          ? (d.Tools.Inform("WebSocket connection configured to autoreconnect, attempting DELAYED reconnect..."),
            setTimeout(function() {
              f.connect();
            }, 5e3))
          : (d.Tools.Inform("WebSocket connection configured to autoreconnect, attempting INSTANT reconnect..."),
            this.connect()));
    };
    b.prototype.onDisconnect = function() {
      this.connection.close();
    };
    b.prototype.onMessageReceived = function(a) {
      switch (this.options.datatype) {
        case "json":
          a = JSON.parse(a.data);
          break;
        default:
          a = a.data;
      }
      this.MessageReceivedSignal.dispatch(a);
    };
    b.prototype.onSendMessage = function(a) {
      this.send(a);
    };
    return b;
  })();
  d.Socket = e;
  e = (function() {
    function b() {}
    Object.defineProperty(b, "DEBUG", {
      get: function() {
        return this._DEBUG;
      },
      set: function(a) {
        (this._DEBUG = a) && this.Warn("Debug mode enabled, make sure to disable for deployment!", !0);
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(b, "prefix", {
      get: function() {
        var a = new Date();
        return (
          "IPMI - [" +
          [this.LPad(a.getHours(), 2, 0), this.LPad(a.getMinutes(), 2, 0), this.LPad(a.getSeconds(), 2, 0)].join(":") +
          "." +
          this.LPad(a.getMilliseconds(), 3, 0) +
          "]: "
        );
      },
      enumerable: !0,
      configurable: !0
    });
    b.LPad = function(a, f, c) {
      void 0 === c && (c = " ");
      c = c.toString();
      a = a.toString();
      for (var b = 0; a.length < f && 200 >= ++b; )
        a.length + c.length > f && (c = c.substr(0, f - a.length)), (a = c + a);
      return a;
    };
    b.RPad = function(a, f, c) {
      void 0 === c && (c = " ");
      c = c.toString();
      a = a.toString();
      for (var b = 0; a.length < f && 200 >= ++b; )
        a.length + c.length > f && (c = c.substr(0, f - a.length)), (a += c);
      return a;
    };
    b.Pad = function(a, f, c) {
      void 0 === c && (c = " ");
      c = c.toString();
      a = a.toString();
      for (var b = !1, d = 0; a.length < f && 200 >= ++d; )
        a.length + c.length > f && (c = c.substr(0, f - a.length)), (a = !0 === b ? c + a : a + c), (b = !b);
      return a;
    };
    b.Rad2Deg = function(a) {
      return 180 * a / Math.PI;
    };
    b.Deg2Rad = function(a) {
      return a / 180 * Math.PI;
    };
    b.Invert = function(a) {
      if ("number" == typeof a) return -a;
      if ("string" == typeof a) return a;
      if ("boolean" == typeof a) return !a;
      if ("object" == typeof a) {
        if (a instanceof Array) for (var f = 0; f < a.length; f++) a[f] = b.Invert(a[f]);
        else for (f in a) a[f] = b.Invert(a[f]);
        return a;
      }
    };
    b.getClassName = function(a) {
      return /function (.{1,})\(/.exec(a.constructor.toString())[1];
    };
    b.LogGroup = function(a) {
      this.DEBUG && console.group.apply(console, ["%c" + this.prefix + a, "color: green; font-weight: bold;"]);
    };
    b.LogGroupEnd = function() {
      this.DEBUG && console.groupEnd();
    };
    b.Debug = function(a) {
      this.DEBUG && console.log("%c" + this.prefix + a, "color: purple; font-weight: bold");
    };
    b.Inform = function(a) {
      this.DEBUG && console.log("%c" + this.prefix + a, "color: #333; font-weight: bold");
    };
    b.Log = function(a, f) {
      (this.DEBUG || f) && console.log("%c" + this.prefix + a, "color: #333; font-weight: bold");
    };
    b.Notify = function(a) {
      this.DEBUG && console.log("%c" + this.prefix + a, "color: blue; font-weight: bold");
    };
    b.Warn = function(a, f) {
      (this.DEBUG || f) && console.log("%c" + this.prefix + a, "color: orange; font-weight: bold");
    };
    b.Error = function(a) {
      a instanceof TypeError
        ? console.log(
            "%c" + this.prefix + a.stack.replace("\n", "\n%c"),
            "color: red; font-weight: bold",
            "color: black; font-weight: normal"
          )
        : console.log("%c" + this.prefix + a, "color: red; font-weight: bold");
    };
    b._DEBUG = !1;
    return b;
  })();
  d.Tools = e;
  e.DEBUG = !1;
  e = (function() {
    function b() {}
    b.prototype.map = function(a) {
      for (var f in a) this.hasOwnProperty("_" + f) ? (this["_" + f] = a[f]) : (this[f] = a[f]);
    };
    return b;
  })();
  d.JSONMapper = e;
  e = (function() {
    function b() {
      this.firstRegistration = new Date().getTime();
    }
    Object.defineProperty(b.prototype, "base", {
      get: function() {
        return { x: this.boundingbox.x + this.boundingbox.width / 2, y: this.boundingbox.y + this.boundingbox.height };
      },
      enumerable: !0,
      configurable: !0
    });
    Object.defineProperty(b.prototype, "top", {
      get: function() {
        return { x: this.boundingbox.x + this.boundingbox.width / 2, y: this.boundingbox.y };
      },
      enumerable: !0,
      configurable: !0
    });
    return b;
  })();
  d.Blob = e;
  e = (function() {
    return function() {
      this.averageMotion = new d.Vec2();
      this.blackPixels = 307200;
      this.whitePixels = 0;
      this.fps = 60;
      this.grid = [];
    };
  })();
  d.Scene = e;
  e = (function() {
    function b(a, f) {
      this.config = a;
      this.root = f;
    }
    b.prototype.start = function() {
      d.Tools.Warn(d.Tools.getClassName(this) + " does not implement the start() method");
    };
    b.prototype.getBlobs = function() {
      d.Tools.Warn(d.Tools.getClassName(this) + " does not implement the getBlobs() method");
      return [];
    };
    return b;
  })();
  d.BaseAdapter = e;
  e = (function(b) {
    function a(a, c) {
      b.call(this, a, c);
      this.blobId = 0;
      this.blob = null;
      this.scene = new d.Scene();
      this.age = 0;
      this.newCentroid = new d.Point2();
      this.oldCentroid = new d.Point2();
      this.interval = null;
      this.start();
    }
    __extends(a, b);
    a.prototype.start = function() {
      var a = this;
      d.Tools.LogGroup("Starting Mouse adapter");
      this.config.pointerTarget
        ? (this.config.pointerTarget.addEventListener("mouseenter", function(c) {
            a.onMouseEnter(c);
          }),
          this.config.pointerTarget.addEventListener("mouseleave", function(c) {
            a.onMouseLeave(c);
          }),
          this.config.pointerTarget.addEventListener("mousemove", function(c) {
            a.onMouseMove(c);
          }),
          (this.interval = setInterval(function() {
            a.age++;
            a.onInterval();
          }, 1e3 / 60)))
        : d.Tools.Error("No pointerTarget passed, mouse can not be used");
    };
    a.prototype.onMouseEnter = function(a) {
      this.blobId++;
      this.age = 0;
      this.blob = new d.Blob();
      this.blob.id = this.blobId;
      this.blob.age = this.age;
      this.blob.centroid = this.calculateCentroid(a.layerX, a.layerY);
      this.blob.boundingbox = this.generateBoundingBox(this.blob.centroid);
      this.blob.contours = this.generateContours(this.blob.centroid, this.blob.boundingbox);
      this.oldCentroid = this.blob.centroid;
      this.blob.velocity = this.calculateVelocity(this.blob.centroid, this.oldCentroid);
      this.onPersonEntered(this.blob);
    };
    a.prototype.onMouseLeave = function(a) {
      this.onPersonLeft(this.blob);
      this.blob = null;
    };
    a.prototype.onMouseMove = function(a) {
      this.blob.age = this.age;
      this.blob.centroid = this.calculateCentroid(a.layerX, a.layerY);
      this.blob.boundingbox = this.generateBoundingBox(this.blob.centroid);
      this.blob.contours = this.generateContours(this.blob.centroid, this.blob.boundingbox);
      this.blob.velocity = this.calculateVelocity(this.newCentroid, this.oldCentroid);
      this.onPersonUpdated(this.blob);
    };
    a.prototype.onInterval = function() {
      this.scene.averageMotion = this.blob ? this.blob.velocity : new d.Vec2();
      this.scene.blackPixels = this.blob ? 291840 : 307200;
      this.scene.whitePixels = this.blob ? 15360 : 0;
      this.scene.fps = 60;
      this.scene.grid = [];
      this.scene.gridX = 10;
      this.scene.gridY = 10;
      this.scene.numPeople = this.blob ? 1 : 0;
      this.scene.percentCovered = this.blob ? 0.05 : 0;
      var a, c;
      this.blob && ((a = Math.floor(10 * this.blob.centroid.y)), (c = Math.floor(10 * this.blob.centroid.x)));
      for (var b = 0; 10 > b; b++)
        for (var g = 0; 10 > g; g++)
          this.blob ? (g == a && b == c ? this.scene.grid.push(1) : this.scene.grid.push(0)) : this.scene.grid.push(0);
      this.onSceneUpdated(this.scene);
    };
    a.prototype.calculateCentroid = function(a, c) {
      this.oldCentroid = new d.Point2(0.7 * this.oldCentroid.x + 0.3 * a, 0.7 * this.oldCentroid.y + 0.3 * c);
      this.newCentroid = new d.Point2(a, c);
      return new d.Point2(a / this.config.pointerTarget.offsetWidth, c / this.config.pointerTarget.offsetHeight);
    };
    a.prototype.calculateVelocity = function(a, c) {
      return new d.Vec2(a.x - c.x, a.y - c.y);
    };
    a.prototype.generateBoundingBox = function(a) {
      var c = a.x - (Math.random() / 50 + 0.1),
        b = a.y - (Math.random() / 50 + 0.1);
      0 > c && (c = 0);
      1 < c && (c = 1);
      0 > b && (b = 0);
      1 < b && (b = 1);
      var g = 2 * (a.x - c),
        e = 2 * (a.y - b);
      1 < c + g && (c -= 1 - (c + g));
      1 < b + e && (b -= 1 - (b + e));
      g = 2 * (a.x - c);
      e = 2 * (a.y - b);
      return new d.BoundingBox(c, b, g, e);
    };
    a.prototype.generateContours = function(a, c) {
      for (var b = [], g = 0, e = c.width / 2, l = c.height / 2; 2 > g; ) {
        var k = a.x + e * Math.cos(g * Math.PI),
          m = a.y + l * Math.sin(g * Math.PI);
        0.5 >= g
          ? ((k -= Math.random() / 50), (m -= Math.random() / 50))
          : 1 >= g
            ? ((k += Math.random() / 50), (m -= Math.random() / 50))
            : ((k = 1.5 >= g ? k + Math.random() / 50 : k - Math.random() / 50), (m += Math.random() / 50));
        b.push(new d.Point2(k, m));
        g += Math.random() / 4;
      }
      return b;
    };
    a.prototype.getBlobs = function() {
      return this.blob ? [this.blob] : [];
    };
    a.prototype.onSceneUpdated = function(a) {
      this.root.SceneUpdatedSignal.dispatch(a);
    };
    a.prototype.onPersonEntered = function(a) {
      this.root.PersonEnteredSignal.dispatch(a);
      this.root.PersonChangedSignal.dispatch();
    };
    a.prototype.onPersonLeft = function(a) {
      this.root.PersonLeftSignal.dispatch(a);
      this.root.PersonChangedSignal.dispatch();
    };
    a.prototype.onPersonUpdated = function(a) {
      this.root.PersonUpdatedSignal.dispatch(a);
      this.root.PersonChangedSignal.dispatch();
    };
    a.prototype.onPersonMoved = function(a) {
      this.root.PersonMovedSignal.dispatch(a);
      this.root.PersonChangedSignal.dispatch();
    };
    return a;
  })(d.BaseAdapter);
  d.MouseAdapter = e;
  e = (function(b) {
    function a(a, c) {
      b.call(this, a, c);
    }
    __extends(a, b);
    return a;
  })(d.BaseAdapter);
  d.SimulationAdapter = e;
  e = (function(b) {
    function a(a, c) {
      b.call(this, a, c);
      this.connected = !1;
      this.blobs = [];
      this.scene = new d.Scene();
      this.maxAge = 1e4;
      this.removeDelay = 2e4;
      this.start();
      this.root.DisconnectSignal.add(this.onDisconnect, this);
      this.root.SendMessageSignal.add(this.onSendMessage, this);
    }
    __extends(a, b);
    a.prototype.start = function() {
      d.Tools.LogGroup("Starting TSPS adapter");
      this.socket = new d.Socket(this.config.hostaddr, this.config.hostport, this.config.hostpath, {
        autoreconnect: !0,
        protocol: "tsps-protocol",
        datatype: "json"
      });
      this.socket.ConnectionOpenedSignal.add(this.onConnected, this, 1);
      this.socket.ConnectionClosedSignal.add(this.onDisconnected, this, 1);
      this.socket.MessageReceivedSignal.add(this.onMessage, this, 1);
      d.Tools.LogGroupEnd();
    };
    a.prototype.updateScene = function(a) {
      var c = this.scene;
      this.reassignSceneProperties(c, a);
      return c;
    };
    a.prototype.createBlob = function(a) {
      var c = new d.Blob();
      this.reassignBlobProperties(c, a);
      return (this.blobs[c.id] = c);
    };
    a.prototype.updateBlob = function(a) {
      var c = this.blobs[a.id] || this.createBlob(a);
      c.age > a.age
        ? console.log("Wrong order message for blob", c.id, "(most recent age:", c.age, "received age:", a.age, ")")
        : (this.reassignBlobProperties(c, a),
          c.removed && ((c.removed = !1), (c.firstRegistration = new Date().getTime())));
      return c;
    };
    a.prototype.removeBlob = function(a) {
      var c = this.blobs[a.id] || this.createBlob(a);
      this.reassignBlobProperties(c, a);
      this.blobs[c.id].removed = !0;
      return c;
    };
    a.prototype.sanitizeBlobs = function() {
      var a = new Date(),
        c = !1,
        b;
      for (b in this.blobs)
        a.getTime() - this.blobs[b].firstRegistration > this.removeDelay
          ? delete this.blobs[b]
          : a.getTime() - this.blobs[b].firstRegistration > this.maxAge &&
            !this.blobs[b].removed &&
            (c = this.blobs[b].removed = !0);
      c && this.root.PersonChangedSignal.dispatch();
    };
    a.prototype.getBlobs = function() {
      var a = [],
        c;
      for (c in this.blobs) this.blobs[c].removed || a.push(this.blobs[c]);
      return a;
    };
    a.prototype.reassignSceneProperties = function(a, c) {
      a.averageMotion = new d.Vec2(c.averageMotion.x, c.averageMotion.y);
      a.blackPixels = c.blackPixels;
      a.fps = c.fps;
      a.grid = c.grid;
      a.gridX = c.gridX;
      a.gridY = c.gridY;
      a.numPeople = c.numPeople;
      a.percentCovered = c.percentCovered;
      a.whitePixels = c.whitePixels;
    };
    a.prototype.reassignBlobProperties = function(a, c) {
      a.id || (a.id = c.id);
      a.age = c.age;
      a.boundingbox = c.boundingrect;
      a.contours = c.contours;
      a.centroid = c.centroid;
      a.velocity = c.velocity;
    };
    a.prototype.onConnected = function() {
      d.Tools.Notify("Connected to TSPS host");
      this.connected = !0;
      this.blobs.length = 0;
      this.root.ConnectionOpenedSignal.dispatch();
    };
    a.prototype.onDisconnected = function() {
      this.connected
        ? d.Tools.Error("Connection to TSPS host lost")
        : d.Tools.Error("Unable to establish a connection to TSPS host");
      this.connected = !1;
      this.root.ConnectionClosedSignal.dispatch();
    };
    a.prototype.onDisconnect = function() {
      this.socket.DisconnectSignal.dispatch();
    };
    a.prototype.onMessage = function(a) {
      this.root.DataReceivedSignal.dispatch(a);
      this.sanitizeBlobs();
      switch (a.type) {
        case "backgroundCaptured":
          this.onBackgroundCaptured(a);
          break;
        case "imageRequested":
          this.onImageRequested(a);
          break;
        case "scene":
          a = this.updateScene(a);
          this.onSceneUpdated(a);
          break;
        case "personEntered":
          a = this.createBlob(a);
          this.onPersonEntered(a);
          break;
        case "personWillLeave":
          a = this.removeBlob(a);
          this.onPersonLeft(a);
          break;
        case "personMoved":
          a = this.updateBlob(a);
          this.onPersonMoved(a);
          break;
        case "personUpdated":
          a = this.updateBlob(a);
          this.onPersonUpdated(a);
          break;
        default:
          this.onUnspecifiedEvent(a);
      }
    };
    a.prototype.onBackgroundCaptured = function(a) {
      d.Tools.Inform("TSPS background recaptured, captureId: " + a.id);
    };
    a.prototype.onImageRequested = function(a) {
      this.root.ImageCapturedSignal.dispatch(a);
    };
    a.prototype.onSceneUpdated = function(a) {
      this.root.SceneUpdatedSignal.dispatch(a);
    };
    a.prototype.onPersonEntered = function(a) {
      this.root.PersonEnteredSignal.dispatch(a);
      this.root.PersonChangedSignal.dispatch();
    };
    a.prototype.onPersonLeft = function(a) {
      this.root.PersonLeftSignal.dispatch(a);
      this.root.PersonChangedSignal.dispatch();
    };
    a.prototype.onPersonUpdated = function(a) {
      this.root.PersonUpdatedSignal.dispatch(a);
      this.root.PersonChangedSignal.dispatch();
    };
    a.prototype.onPersonMoved = function(a) {
      this.root.PersonMovedSignal.dispatch(a);
      this.root.PersonChangedSignal.dispatch();
    };
    a.prototype.onSendMessage = function(a) {
      this.socket.SendMessageSignal.dispatch(a);
    };
    a.prototype.onUnspecifiedEvent = function(a) {
      this.root.UnspecifiedEventSignal.dispatch(a);
    };
    return a;
  })(d.BaseAdapter);
  d.TSPSAdapter = e;
  e = (function(b) {
    function a(a, c) {
      b.call(this, a, c);
      this.lastSimTime = this.currentSimFrame = this.simFrames = 0;
    }
    __extends(a, b);
    a.prototype.start = function() {
      var a = this;
      d.Tools.Log("Bypassed TSPS connection setup");
      this.loadSimFile(this.config).then(function(c) {
        a.simData = c;
        a.startSimulation();
      });
    };
    a.prototype.loadSimFile = function(a) {
      return new Promise(function(c, b) {
        var g = new XMLHttpRequest();
        g.open("GET", a.simfile);
        g.onload = function() {
          200 === g.status
            ? (d.Tools.Log("Loaded simulation file: " + a.simfile), c(JSON.parse(g.responseText)))
            : b(d.Tools.Error("Cannot load simulation file: " + a.simfile));
        };
        g.onerror = function() {
          b(d.Tools.Error("Cannot load simulation file: " + a.simfile));
        };
        g.send();
      });
    };
    a.prototype.startSimulation = function() {
      this.runFrame();
    };
    a.prototype.runFrame = function() {
      var a = this,
        c = this.simData[this.currentSimFrame++];
      c || ((this.currentSimFrame = 0), (c = this.simData[this.currentSimFrame++]));
      var b = (this.lastSimTime = c.__time__),
        d = this.simData[this.currentSimFrame],
        e = 500;
      d && (e = d.__time__ - b);
      this.onMessage(c);
      setTimeout(function() {
        return a.runFrame();
      }, e);
    };
    return a;
  })(d.TSPSAdapter);
  d.TSPSSimulationAdapter = e;
  (function(b) {
    b[(b.TSPS = 1)] = "TSPS";
    b[(b.TSPSSimulator = 2)] = "TSPSSimulator";
    b[(b.Mouse = 3)] = "Mouse";
    b[(b.Touch = 4)] = "Touch";
    b[(b.Simulator = 5)] = "Simulator";
  })(d.TrackingMethod || (d.TrackingMethod = {}));
  var l = d.TrackingMethod,
    e = (function() {
      function b(a) {
        this.ConnectionOpenedSignal = new d.Signal("ConnectionOpened");
        this.ConnectionClosedSignal = new d.Signal("ConnectionClosed");
        this.SendMessageSignal = new d.Signal("SendMessage");
        this.DisconnectSignal = new d.Signal("Disconnect");
        this.DataReceivedSignal = new d.Signal("DataReceived");
        this.UnspecifiedEventSignal = new d.Signal("UnspecifiedEvent");
        this.SceneUpdatedSignal = new d.Signal("SceneUpdated");
        this.PersonEnteredSignal = new d.Signal("PersonEntered");
        this.PersonLeftSignal = new d.Signal("PersonLeft");
        this.PersonUpdatedSignal = new d.Signal("PersonUpdated");
        this.PersonMovedSignal = new d.Signal("PersonMoved");
        this.PersonChangedSignal = new d.Signal("PersonChanged");
        this.ImageCapturedSignal = new d.Signal("ImageCaptured");
        d.Tools.LogGroup("Start tracking module");
        this.config = a;
        this.loadAdapter(a);
        d.Tools.LogGroupEnd();
      }
      b.prototype.loadAdapter = function(a) {
        switch (a.method) {
          case l.TSPS:
            d.Tools.Inform("Load tracking adapter for TSPS");
            this.adapter = new d.TSPSAdapter(a, this);
            break;
          case l.TSPSSimulator:
            d.Tools.Inform("Load tracking adapter for TSPS");
            this.adapter = new d.TSPSSimulationAdapter(a, this);
            break;
          case l.Mouse:
          case l.Touch:
            d.Tools.Inform("Load tracking adapter for Mouse/Touch");
            this.adapter = new d.MouseAdapter(a, this);
            break;
          case l.Simulator:
            d.Tools.Inform("Load tracking adapter for Simulator");
            this.adapter = new d.SimulationAdapter(a, this);
            break;
          default:
            d.Tools.Error("Invalid adapter type specified");
        }
      };
      b.prototype.getBlobs = function() {
        return this.adapter.getBlobs();
      };
      return b;
    })();
  d.Tracking = e;
  e = (function() {
    function b(a, b, c, e, g) {
      void 0 === c && (c = !0);
      void 0 === e && (e = !0);
      void 0 === g && (g = !1);
      this.reduceCameraRequests = 1;
      this.cameraRequestSequence = 0;
      this.tracking = a;
      this.canvas = b;
      this.shouldAutoUpdate = c;
      this.shouldCaptureBackground = e;
      this.shouldUseCamera = g;
      this.context = this.canvas.getContext("2d");
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetWidth;
      this.backgroundCanvas = document.createElement("canvas");
      this.backgroundContext = this.backgroundCanvas.getContext("2d");
      this.cameraCanvas = document.createElement("canvas");
      this.cameraContext = this.cameraCanvas.getContext("2d");
      this.differenceCanvas = document.createElement("canvas");
      this.differenceContext = this.differenceCanvas.getContext("2d");
      e && this.tracking.ConnectionOpenedSignal.add(this.captureBackground, this);
      g &&
        d.Tools.DEBUG &&
        (this.tracking.PersonChangedSignal.add(this.captureCamera, this),
        d.Tools.Warn(
          "TrackingVisualizer, using camera capture severely impacts tracking performance, do not use by default!"
        ));
      (e || g) && this.tracking.ImageCapturedSignal.add(this.imageCaptured, this);
      c && this.tracking.SceneUpdatedSignal.add(this.autoUpdate, this);
    }
    b.prototype.autoUpdate = function(a) {
      var b = this.tracking.getBlobs();
      this.update(b, a.gridX, a.gridY, a.grid);
    };
    b.prototype.update = function(a, b, c, d) {
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetWidth;
      this.shouldCaptureBackground &&
        this.context.drawImage(this.backgroundCanvas, 0, 0, this.canvas.width, this.canvas.height);
      this.shouldUseCamera && this.context.drawImage(this.cameraCanvas, 0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(this.differenceCanvas, 0, 0, this.canvas.width, this.canvas.height);
      if (b && c) {
        for (var e = 0; e < b; e++) this.drawGridLineX(b, e);
        for (var h = 0; h < c; h++) this.drawGridLineY(c, h);
        for (var k, e = 0; e < b; e++)
          for (h = 0; h < c; h++) (k = d[e * c + h] ? !0 : !1) && this.drawGridBlock(b, c, e, h);
      }
      for (var l in a) this.drawBlob(a[l]);
    };
    b.prototype.captureBackground = function() {
      this.tracking.SendMessageSignal.dispatch({ request: "background" });
    };
    b.prototype.captureCamera = function() {
      this.cameraRequestSequence++;
      0 == this.cameraRequestSequence % this.reduceCameraRequests &&
        this.tracking.SendMessageSignal.dispatch({ request: "area" });
    };
    b.prototype.imageCaptured = function(a) {
      var b, c;
      switch (a.imageType) {
        case "background":
          b = this.backgroundCanvas;
          c = this.backgroundContext;
          break;
        case "area":
          b = this.cameraCanvas;
          c = this.cameraContext;
          break;
        case "difference":
          b = this.differenceCanvas;
          c = this.differenceContext;
          break;
        default:
          return;
      }
      var d = a.width,
        e = a.height;
      b.width = d;
      b.height = e;
      b = a.data;
      d = c.createImageData(d, e);
      e = d.data;
      a = this.shouldCaptureBackground ? a.imageType : "background";
      for (var h = 0; h < e.length; h += 4)
        switch (a) {
          case "background":
            e[h] = b[h / 4];
            e[h + 1] = b[h / 4];
            e[h + 2] = b[h / 4];
            e[h + 3] = 255;
            break;
          case "area":
            e[h] = 0;
            e[h + 1] = b[h / 4];
            e[h + 2] = 0;
            e[h + 3] = 127;
            break;
          case "difference":
            (e[h] = 255), (e[h + 1] = 165), (e[h + 2] = 0), (e[h + 3] = b[h / 4] / 2);
        }
      c.putImageData(d, 0, 0);
      this.update();
    };
    b.prototype.drawGridLineX = function(a, b) {
      this.context.strokeStyle = "rgba(0, 255, 255, 0.25)";
      this.context.beginPath();
      this.context.moveTo(this.canvas.width / a * b, 0);
      this.context.lineTo(this.canvas.width / a * b, this.canvas.height);
      this.context.stroke();
    };
    b.prototype.drawGridLineY = function(a, b) {
      this.context.strokeStyle = "rgba(0, 255, 255, 0.25)";
      this.context.beginPath();
      this.context.moveTo(0, this.canvas.height / a * b);
      this.context.lineTo(this.canvas.width, this.canvas.height / a * b);
      this.context.stroke();
    };
    b.prototype.drawGridBlock = function(a, b, c, d) {
      this.context.fillStyle = "rgba(0, 255, 255, 0.4)";
      this.context.rect(
        this.canvas.width / a * c + 1,
        this.canvas.height / b * d + 1,
        this.canvas.width / a - 2,
        this.canvas.height / b - 2
      );
      this.context.fill();
    };
    b.prototype.drawBlob = function(a) {
      this.drawContours(a);
      this.drawBoundingBox(a);
      this.drawVelocityVector(a);
      this.drawInformation(a);
      this.drawPoints(a);
    };
    b.prototype.toAbsoluteX = function(a) {
      return a * this.canvas.width;
    };
    b.prototype.toAbsoluteY = function(a) {
      return a * this.canvas.height;
    };
    b.prototype.drawContours = function(a) {
      if (a.contours.length) {
        this.context.beginPath();
        this.context.moveTo(this.toAbsoluteX(a.contours[0].x), this.toAbsoluteY(a.contours[0].y));
        for (var b = 1; b < a.contours.length; b++)
          this.context.lineTo(this.toAbsoluteX(a.contours[b].x), this.toAbsoluteY(a.contours[b].y));
        this.context.fillStyle = "rgba(255, 0, 0, 0.5)";
        this.context.fill();
        this.context.strokeStyle = "#D00";
        this.context.stroke();
        this.context.closePath();
      }
    };
    b.prototype.drawBoundingBox = function(a) {
      this.context.beginPath();
      this.context.strokeStyle = "#00D";
      this.context.strokeRect(
        this.toAbsoluteX(a.boundingbox.x),
        this.toAbsoluteY(a.boundingbox.y),
        this.toAbsoluteX(a.boundingbox.width),
        this.toAbsoluteY(a.boundingbox.height)
      );
      this.context.closePath();
    };
    b.prototype.drawVelocityVector = function(a) {
      var b = this.toAbsoluteX(a.centroid.x),
        c = this.toAbsoluteY(a.centroid.y),
        d = this.toAbsoluteX(a.centroid.x) + 5 * a.velocity.x;
      a = this.toAbsoluteY(a.centroid.y) + 5 * a.velocity.y;
      var e = Math.atan2(a - c, d - b);
      this.context.strokeStyle = "rgba(0, 0, 255, 0.25)";
      this.context.lineWidth = 2;
      this.context.beginPath();
      this.context.moveTo(b, c);
      this.context.lineTo(d, a);
      this.context.lineTo(d - 5 * Math.cos(e - Math.PI / 6), a - 5 * Math.sin(e - Math.PI / 6));
      this.context.moveTo(d, a);
      this.context.lineTo(d - 5 * Math.cos(e + Math.PI / 6), a - 5 * Math.sin(e + Math.PI / 6));
      this.context.stroke();
    };
    b.prototype.drawInformation = function(a) {
      this.context.beginPath();
      this.context.font = "bold 24px monospace";
      this.context.fillStyle = "#000";
      this.context.fillText("#" + a.id, this.toAbsoluteX(a.centroid.x) + 10, this.toAbsoluteY(a.centroid.y) + 24);
      this.context.strokeStyle = "#000";
      this.context.strokeText("#" + a.id, this.toAbsoluteX(a.centroid.x) + 10, this.toAbsoluteY(a.centroid.y) + 24);
      this.context.closePath();
    };
    b.prototype.drawPoints = function(a) {
      this.context.beginPath();
      this.context.arc(this.toAbsoluteX(a.centroid.x), this.toAbsoluteY(a.centroid.y), 5, 0, 2 * Math.PI);
      this.context.fillStyle = "#0D0";
      this.context.fill();
      this.context.closePath();
      this.context.beginPath();
      this.context.arc(this.toAbsoluteX(a.top.x), this.toAbsoluteY(a.top.y), 5, 0, 2 * Math.PI);
      this.context.fillStyle = "#DD0";
      this.context.fill();
      this.context.closePath();
      this.context.beginPath();
      this.context.arc(this.toAbsoluteX(a.base.x), this.toAbsoluteY(a.base.y), 5, 0, 2 * Math.PI);
      this.context.fillStyle = "#0DD";
      this.context.fill();
      this.context.closePath();
    };
    return b;
  })();
  d.TrackingVisualizer = e;
  e = (function() {
    function b(a) {
      d.Tools.LogGroup("Start IPMI framework");
      this.config = a;
      this.setupTracking();
      d.Tools.LogGroupEnd();
    }
    b.prototype.setupTracking = function() {
      this.Tracking = new d.Tracking(this.config.tracking);
    };
    return b;
  })();
  d.Framework = e;
})(IPMI || (IPMI = {}));
(("undefined" != typeof window && window.module) || "undefined" != typeof module) &&
  "undefined" != typeof module.exports &&
  (module.exports = IPMI);
