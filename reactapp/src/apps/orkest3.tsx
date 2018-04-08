import React = require("react");
import Video from "../components/video";
import { ipmiConfig } from "../ipmi_config";
import { observable } from "mobx";
import { observer } from "mobx-react";

const IPMI = require("../lib/ipmi.js");
IPMI.Tools.DEBUG = true;
const IPMIFramework = new IPMI.Framework(ipmiConfig);

@observer
export default class DemoApp1 extends React.Component {
  @observable private video1: Video;
  @observable private video2: Video;

  public componentDidMount() {
    this.stopInteraction();
    this.video1.vid.volume = 0;

    IPMIFramework.Tracking.PersonEnteredSignal.add((blob: any) => {
      this.video1.finish();
    });

    IPMIFramework.Tracking.PersonLeftSignal.add((blob: any) => {
      this.video2.finish();
    });
  }

  public componentWillUnmount() {
    IPMIFramework.Tracking.PersonEnteredSignal.removeAll();
    IPMIFramework.Tracking.PersonLeftSignal.removeAll();
  }

  public startInteraction() {
    this.video1.hide();
    this.video2.show();
    this.video1.pause();
    this.video2.play();
  }

  public stopInteraction() {
    this.video2.hide();
    this.video1.show();
    this.video2.pause();
    this.video1.play();
  }

  public render() {
    return (
      <div>
        <Video
          loop={true}
          src="apps/orkestvanhetoosten/app3/loop.mp4"
          onReady={(video: any) => {
            this.video1 = video;
          }}
          onFinishedPlaying={() => this.startInteraction()}
        />
        <Video
          loop={false}
          src="apps/orkestvanhetoosten/app3/vid.mp4"
          onReady={(video: any) => {
            this.video2 = video;
          }}
          onFinishedPlaying={() => this.stopInteraction()}
        />
      </div>
    );
  }
}
