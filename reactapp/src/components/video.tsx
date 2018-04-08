import * as React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";

interface Props {
  style?: any;
  src: string;
  width?: string;
  height?: string;
  loop?: boolean;
  loopCount?: number;
  autoplay?: boolean;
  onReady?(video: any): any;
  onFinishedPlaying?(video: any): any;
}

@observer
export default class Video extends React.Component<Props, {}> {
  @observable public loop: boolean = false;
  @observable public style: any = false;

  public vid: any;
  public width: number | string;
  public height: number | string;
  public loopCount: number = 0;
  public autoplay: boolean = false;
  public playing: boolean = false;
  public breakLoop: boolean = false;
  public done: boolean = false;

  constructor(props: Props) {
    super(props);
    this.width = props.width || "100%";
    this.height = props.height || "100%";
    this.loop = this.props.loop || false;
    this.autoplay = this.props.autoplay || false;
    this.style = this.props.style || {};
  }

  public play() {
    this.vid.play();
  }

  public pause() {
    this.vid.pause();
  }

  public finish() {
    this.loop = false;
  }

  public show() {
    this.style = { ...this.style, display: "block" };
  }

  public hide() {
    this.style = { ...this.style, display: "none" };
  }

  public gotoAndStop(time: number) {
    this.vid.currentTime = time;
  }

  public componentDidMount() {
    this.vid.addEventListener("canplay", () => {
      if (this.autoplay && (this.loop || this.loopCount === 0)) {
        this.play();
        this.playing = true;
      }

      this.loopCount++;
    });

    this.vid.addEventListener("ended", () => {
      this.done = true;
      this.loop = this.props.loop || false;
      if (this.props.onFinishedPlaying) {
        this.props.onFinishedPlaying(this);
      }
    });

    if (this.props.onReady) {
      this.props.onReady(this);
    }
  }

  public render() {
    return (
      <video
        className="video"
        ref={vid => (this.vid = vid)}
        loop={this.loop}
        width={this.width}
        height={this.height}
        style={this.style}
        autoPlay={true}
      >
        <source src={this.props.src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }
}
