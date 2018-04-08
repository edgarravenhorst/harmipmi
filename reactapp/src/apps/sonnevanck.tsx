import React = require("react");
import Video from "../components/video";
import Sequence from "../components/sequence";
import { ipmiConfig } from "../ipmi_config";
import { observable } from "mobx";
import { observer } from "mobx-react";

const IPMI = require("../lib/ipmi.js");
IPMI.Tools.DEBUG = true;
const IPMIFramework = new IPMI.Framework(ipmiConfig);

@observer
export default class DemoApp1 extends React.Component {
  @observable private vid: any;
  @observable private _video1: Video;
  @observable private _text: Sequence;
  @observable private _sequence1: Sequence;
  @observable private _sequence2: Sequence;
  @observable private _reverseIntro: boolean = false;
  @observable public active: boolean = false;
  @observable public stopAfterText: boolean = false;
  @observable public currentText: any;

  public textTimeout: any;

  private texts = [
    <Sequence
      key="text1"
      ref={(ref: Sequence) => (this._text = ref)}
      baseUrl="apps/sonnevanck/text/PNG-001/001_"
      fileExtention=".png"
      frameCount={76}
      speed={0.4}
    />,
    <Sequence
      key="text2"
      ref={(ref: Sequence) => (this._text = ref)}
      baseUrl="apps/sonnevanck/text/PNG-002/002_"
      fileExtention=".png"
      frameCount={76}
      speed={0.4}
    />,
    <Sequence
      key="text3"
      ref={(ref: Sequence) => (this._text = ref)}
      baseUrl="apps/sonnevanck/text/PNG-003/003_"
      fileExtention=".png"
      frameCount={76}
      speed={0.4}
    />,
    <Sequence
      key="text4"
      ref={(ref: Sequence) => (this._text = ref)}
      baseUrl="apps/sonnevanck/text/PNG-004/004_"
      fileExtention=".png"
      frameCount={76}
      speed={0.4}
    />,
    <Sequence
      key="text5"
      ref={(ref: Sequence) => (this._text = ref)}
      baseUrl="apps/sonnevanck/text/PNG-005/005_"
      fileExtention=".png"
      frameCount={76}
      speed={0.4}
    />
  ];

  public componentDidMount() {
    this._sequence2.playLoop();
    this.vid.play();
    this.vid.volume = 0;

    IPMIFramework.Tracking.PersonEnteredSignal.add(this.sceneUpdated);
    IPMIFramework.Tracking.PersonLeftSignal.add(this.sceneUpdated);
  }

  public componentWillUnmount() {
    this.vid.volume = 0;
    this.vid.pause();

    IPMIFramework.Tracking.PersonEnteredSignal.removeAll();
    IPMIFramework.Tracking.PersonLeftSignal.removeAll();
  }

  private sceneUpdated = (blob: any) => {
    if (IPMIFramework.Tracking.getBlobs().length > 0 && !this.active) {
      this.startInteraction();
    }

    if (IPMIFramework.Tracking.getBlobs().length === 0 && this.active) {
      if (this._text && this._text.visible) {
        this.stopAfterText = true;
        return;
      }

      this._sequence1.reverse = true;
      this._sequence1.play(undefined, undefined, this.stopInteraction);
    }
  };

  public startInteraction = () => {
    this.active = true;
    this.vid.volume = 1;

    this._sequence1.visible = true;
    this._sequence1.reverse = false;
    this._sequence1.play();

    this._sequence2.pause();
    this._sequence2.visible = false;

    this.showText();
  };

  private showText() {
    clearTimeout(this.textTimeout);
    this.textTimeout = setTimeout(() => {
      this.currentText = this.texts[Math.floor(Math.random() * this.texts.length)];
      this._text.visible = true;
      this._text.currentFrame = 0;
      this._text.play(undefined, undefined, () => {
        this._text.reverse = true;
        this._text.play(undefined, undefined, () => {
          this._text.visible = false;
          if (this.stopAfterText) {
            this.stopAfterText = false;
            this._sequence1.reverse = true;
            this._sequence1.play(undefined, undefined, this.stopInteraction);
          }
        });
      });
    }, 3000);
  }

  public stopInteraction = () => {
    this.active = false;
    this.vid.volume = 0;
    this._sequence1.visible = false;

    this._sequence2.visible = true;
    this._sequence2.playLoop();
    clearTimeout(this.textTimeout);
  };

  public render() {
    return (
      <div>
        <video ref={ref => (this.vid = ref)} className="video" loop={true} width="100%" height="100%" autoPlay={true}>
          <source src="apps/sonnevanck/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <Sequence
          key="_sequence1"
          ref={(ref: Sequence) => (this._sequence1 = ref)}
          baseUrl="apps/sonnevanck/logo_interaction/LOGO_MASK_TRANSITION_00-OUT_"
          fileExtention=".png"
          frameCount={74}
          speed={1}
        />

        <Sequence
          key="_sequence2"
          ref={(ref: Sequence) => (this._sequence2 = ref)}
          baseUrl="apps/sonnevanck/logo/LOGO_MAIN_00-LOOP_"
          fileExtention=".png"
          frameCount={125}
          speed={1}
        />

        {this.currentText}
      </div>
    );
  }
}
