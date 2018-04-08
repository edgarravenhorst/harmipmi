declare namespace IPMI {
  interface HostConfig {
    hostaddr: string;
    hostport: number;
    hostpath?: string;
  }
}

declare namespace IPMI {
  class Vec2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
  }
}

declare namespace IPMI {
  class Point2 extends Vec2 {
    constructor(x?: number, y?: number);
  }
}

declare namespace IPMI {
  class BoundingBox {
    height: number;
    width: number;
    x: number;
    y: number;
  }
}

declare namespace IPMI {
  class SignalBinding {
    private signal;
    listener: Function;
    context: Object;
    private isOnce;
    priority: number;
    active: boolean;
    constructor(signal: Signal, listener: Function, context: Object, once?: boolean, priority?: number);
    execute(params: Array<any>): boolean;
    detach(): void;
    destroy(): void;
  }
  class Signal {
    private name;
    private bindings;
    constructor(name: string);
    private addBinding(binding);
    private validateListener(listener, method);
    private indexOfListener(listener, context);
    has(listener: Function, context?: Object): boolean;
    add(listener: Function, context?: Object, priority?: number): Signal;
    addOnce(listener: Function, context?: Object, priority?: number): Signal;
    remove(listener: Function, context: Object): Signal;
    removeAll(): Signal;
    dispatch(...params: Array<any>): Signal;
    dispose(): void;
  }
}

declare namespace IPMI {
  interface SocketOptions {
    autoreconnect?: boolean;
    protocol?: string;
    datatype?: string;
  }
  class Socket {
    private connection;
    private hostaddr;
    private hostport;
    private hostpath;
    private options;
    private connected;
    private retries;
    ConnectionOpenedSignal: Signal;
    ConnectionClosedSignal: Signal;
    DisconnectSignal: Signal;
    MessageReceivedSignal: Signal;
    SendMessageSignal: Signal;
    constructor(hostaddr?: string, hostport?: number, hostpath?: string, options?: SocketOptions);
    connect(): void;
    send(data: any): void;
    private onConnectionOpened(evt);
    private onConnectionClosed(evt);
    private onDisconnect();
    private onMessageReceived(evt);
    private onSendMessage(data);
  }
}

declare namespace IPMI {
  class Tools {
    private static _DEBUG;
    static DEBUG: boolean;
    private static prefix;
    static LPad(input: any, len: number, pad?: any): string;
    static RPad(input: any, len: number, pad?: any): string;
    static Pad(input: any, len: number, pad?: any): string;
    static Rad2Deg(rad: number): number;
    static Deg2Rad(deg: number): number;
    static Invert(value: any): any;
    static getClassName(classInstance: any): string;
    static LogGroup(group: string): void;
    static LogGroupEnd(): void;
    static Debug(debug: string): void;
    static Inform(inform: string): void;
    static Log(log: string, override?: boolean): void;
    static Notify(notification: string): void;
    static Warn(warning: string, override?: boolean): void;
    static Error(error: any): void;
  }
  class JSONMapper {
    map(JSONObject: Object): void;
  }
}

declare namespace IPMI {
  class Blob {
    id: number;
    age: number;
    firstRegistration: number;
    removed: boolean;
    boundingbox: BoundingBox;
    contours: Point2[];
    centroid: Point2;
    velocity: Vec2;
    base: Point2;
    top: Point2;
    constructor();
  }
}

declare namespace IPMI {
  class BaseAdapter {
    config: TrackingConfig;
    root: Tracking;
    constructor(config: TrackingConfig, root: Tracking);
    protected start(): void;
    getBlobs(): Blob[];
  }
}

declare namespace IPMI {
  class MouseAdapter extends BaseAdapter {
    constructor(config: TrackingConfig, root: Tracking);
  }
}

declare namespace IPMI {
  class SimulationAdapter extends BaseAdapter {
    constructor(config: TrackingConfig, root: Tracking);
  }
}

declare namespace IPMI {
  interface TSPSPersonType {
    type: string;
    id: number;
    age: number;
    depth: number;
    centroid: Point2;
    velocity: Vec2;
    boundingrect: BoundingBox;
    opticalflow: Vec2;
    haarrect: BoundingBox;
    highest: Point2;
    contours: Point2[];
  }
  class TSPSAdapter extends BaseAdapter {
    private socket;
    private connected;
    private blobs;
    private maxAge;
    private removeDelay;
    constructor(config: TrackingConfig, root: Tracking);
    protected start(): void;
    private createBlob(data);
    private updateBlob(data);
    private removeBlob(data);
    private sanitizeBlobs();
    getBlobs(): Blob[];
    private reassignProperties(blob, data);
    private onConnected();
    private onDisconnected();
    private onDisconnect();
    protected onMessage(data: any): void;
    private onBackgroundCaptured(data);
    private onImageRequested(data);
    private onSceneUpdated(data);
    private onPersonEntered(data);
    private onPersonLeft(data);
    private onPersonUpdated(data);
    private onPersonMoved(data);
    private onSendMessage(data);
    private onUnspecifiedEvent(data);
  }
}

declare namespace IPMI {
  class TSPSSimulationAdapter extends TSPSAdapter {
    private simData;
    constructor(config: TrackingConfig, root: Tracking);
    protected start(): void;
    private loadSimFile(config);
    private simFrames;
    private currentSimFrame;
    private lastSimTime;
    private startSimulation();
    private runFrame();
  }
}

declare namespace IPMI {
  enum TrackingMethod {
    TSPS = 1,
    TSPSSimulator = 2,
    Mouse = 3,
    Touch = 4,
    Simulator = 5
  }
  interface TrackingConfig extends HostConfig {
    method: TrackingMethod;
    simfile?: string;
    simspeed?: number;
  }
  class Tracking {
    private config;
    private adapter;
    ConnectionOpenedSignal: Signal;
    ConnectionClosedSignal: Signal;
    SendMessageSignal: Signal;
    DisconnectSignal: Signal;
    DataReceivedSignal: Signal;
    UnspecifiedEventSignal: Signal;
    SceneUpdatedSignal: Signal;
    PersonEnteredSignal: Signal;
    PersonLeftSignal: Signal;
    PersonUpdatedSignal: Signal;
    PersonMovedSignal: Signal;
    PersonChangedSignal: Signal;
    ImageCapturedSignal: Signal;
    constructor(config: TrackingConfig);
    private loadAdapter(config);
    getBlobs(): Blob[];
  }
}

declare namespace IPMI {
  class TrackingVisualizer {
    private tracking;
    private canvas;
    private shouldAutoUpdate;
    private shouldCaptureBackground;
    private shouldUseCamera;
    private context;
    private backgroundCanvas;
    private backgroundContext;
    private cameraCanvas;
    private cameraContext;
    private differenceCanvas;
    private differenceContext;
    private reduceCameraRequests;
    private cameraRequestSequence;
    constructor(
      tracking: Tracking,
      canvas: HTMLElement | HTMLCanvasElement,
      shouldAutoUpdate?: boolean,
      shouldCaptureBackground?: boolean,
      shouldUseCamera?: boolean
    );
    autoUpdate(): void;
    update(blobs?: Blob[]): void;
    private captureBackground();
    private captureCamera();
    imageCaptured(image: any): void;
    private draw(blob);
    private toAbsoluteX(x);
    private toAbsoluteY(y);
    private drawContours(blob);
    private drawBoundingBox(blob);
    private drawInformation(blob);
    private drawPoints(blob);
  }
}

/// <reference path="../compiler/tools/typings/es6-promise/es6-promise.d.ts" />
declare namespace IPMI {
  interface FrameworkConfig {
    tracking: TrackingConfig;
  }
  class Framework {
    private config;
    Tracking: Tracking;
    constructor(config: FrameworkConfig);
    private setupTracking();
  }
}
