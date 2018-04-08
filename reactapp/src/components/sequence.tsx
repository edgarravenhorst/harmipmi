import React = require("react");
import Frame from "./frame";
import { observer } from "mobx-react";
import { observable } from "mobx";

import { TweenLite } from "gsap";

interface Props {
  baseUrl: string;
  frameCount: number;
  fileExtention: string;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  firstFrame?: number;
  lastFrame?: number;
  reverse?: boolean;
  onFinishedPlaying?(): any;
  numsize?: string;
  speed?: number;
  visible?: boolean;
  autoplay?: boolean;
  style?: any;
}

@observer
export default class Sequence extends React.Component<Props, {}> {
  @observable public frameCount: number;
  @observable public baseUrl: string;
  @observable public fileExtention: string;
  @observable public currentFrame: number = 0;
  @observable public firstFrame: number = 0;
  @observable public lastFrame: number = 0;
  @observable public reverse: boolean = false;
  @observable public speed: number = 0.25;
  @observable public visible: boolean = true;
  @observable public onFinishedPlaying: any;
  @observable public autoplay: boolean = false;

  @observable public width: number | string = "100%";
  @observable public height: number | string = "100%";

  @observable public loop: boolean = false;

  public framesLoaded: any;
  public preloadPercent: any;

  private _frames: Frame[] = [];
  private _toFrameInterval: any;

  constructor(props: Props) {
    super(props);
    this.baseUrl = this.props.baseUrl;
    this.frameCount = this.props.frameCount;
    this.fileExtention = this.props.fileExtention;
    this.width = this.props.width || this.width;
    this.height = this.props.height || this.height;
    this.loop = this.props.loop || this.loop;
    this.reverse = this.props.reverse || this.reverse;
    this.speed = this.props.speed || this.speed;
    this.visible = this.props.visible || this.visible;
    this.onFinishedPlaying = this.props.onFinishedPlaying || this.onFinishedPlaying;

    this.firstFrame = this.props.firstFrame || 0;
    this.lastFrame = this.props.lastFrame || this.frameCount;

    this.initFrames();
  }

  public initFrames() {
    for (let i = 0; i < this.frameCount; i++) {
      let num = i.toString();
      let zeros = this.props.numsize || "00000";

      if (num.length < zeros.length) {
        zeros = zeros.substring(0, zeros.length - num.length);
        num = zeros + num;
      }
      const src = this.baseUrl + num + this.fileExtention;
      this._frames.push(
        new Frame(src, () => {
          this.framesLoaded++;
          this.preloadPercent = Math.ceil(this.framesLoaded / this.frameCount * 100);
        })
      );
    }
  }

  public play(to?: any, speed?: number, onComplete?: any) {
    let nextFrame = this.currentFrame;

    if (this.reverse) {
      to = to || 0;
      if (nextFrame <= 0) {
        nextFrame = this.frameCount - 1;
      }
    } else {
      to = to || this.frameCount - 1;
      if (nextFrame >= this.frameCount) {
        nextFrame = 0;
      }
    }

    clearInterval(this._toFrameInterval);
    this._toFrameInterval = setInterval(() => {
      if (this.reverse) {
        nextFrame -= speed || this.speed;
      } else {
        nextFrame += speed || this.speed;
      }

      if ((this.reverse && nextFrame <= to) || (!this.reverse && nextFrame >= to)) {
        clearInterval(this._toFrameInterval);
        nextFrame = to;
        if (onComplete) {
          onComplete();
        }
      }

      this.renderFrame(Math.ceil(nextFrame));
    }, 1000 / 60);
  }

  public componentDidMount() {
    this.currentFrame = 0;
    if (this.autoplay) {
      if (this.loop) {
        this.reverse
          ? this.playLoop(this.frameCount - 1, 0, this.speed)
          : this.playLoop(0, this.frameCount - 1, this.speed);
      } else {
        this.play(this.frameCount - 1, this.speed, this.onFinishedPlaying);
      }
    }
  }

  public componentWillUnmount() {
    clearInterval(this._toFrameInterval);
  }

  public pause() {
    clearInterval(this._toFrameInterval);
  }

  public playLoop(from?: number, to?: number, speed?: number) {
    from = from || 0;
    to = to || this.frameCount - 1;

    this.play(to, speed, () => {
      this.currentFrame = from || 0;
      this.playLoop(from, to, speed);
    });
  }

  private renderFrame(frame: any) {
    this.currentFrame = frame;
  }

  public render() {
    return (
      <div
        className="sequence"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: this.width,
          height: this.height,
          backgroundImage: `url('${this._frames[this.currentFrame].src}')`,
          visibility: this.visible ? "visible" : "hidden",
          opacity: this.visible ? 1 : 0,
          ...(this.props.style || {})
        }}
      />
    );
  }
}
