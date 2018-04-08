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
export default class Concordia extends React.Component {
  @observable private loop: Sequence;
  @observable private scrubber: Sequence;
  @observable public active: boolean = false;

  private overlay: any;

  public componentDidMount() {
    this.active = true;
    this.scrubber.pause();
    this.loop.playLoop();

    IPMIFramework.Tracking.PersonEnteredSignal.add(this.onPersonEntered);
    IPMIFramework.Tracking.PersonUpdatedSignal.add(this.onPersonUpdate);
    IPMIFramework.Tracking.PersonLeftSignal.add(this.onPersonLeave);
  }

  public componentWillUnmount() {
    this.active = false;
    IPMIFramework.Tracking.PersonEnteredSignal.removeAll();
    IPMIFramework.Tracking.PersonUpdatedSignal.removeAll();
    IPMIFramework.Tracking.PersonLeftSignal.removeAll();
  }

  public startInteraction = () => {
    this.scrubber.visible = true;
    this.loop.visible = false;
    this.loop.pause();
  };

  public stopInteraction = () => {
    this.scrubber.visible = false;
    this.loop.visible = true;
    this.loop.currentFrame = 0;
    this.loop.playLoop();
  };

  private onPersonEntered = (blob: any) => {
    this.startInteraction();
  };

  private onPersonLeave = (blob: any) => {
    if (!IPMIFramework.Tracking.getBlobs().length) {
      this.stopInteraction();
    }
  };

  private onPersonUpdate = (blob: any) => {
    if (this.scrubber && blob.id === IPMIFramework.Tracking.getBlobs()[0].id) {
      this.scrubber.currentFrame = Math.floor(this.scrubber.frameCount * (1 - blob.centroid.x));
    }
  };

  public render() {
    return (
      <div>
        <Sequence
          ref={(ref: Sequence) => (this.scrubber = ref)}
          key="scrubber"
          baseUrl="apps/concordia/interactive/hackethon_InteractiveFrank"
          numsize="0000"
          fileExtention=".jpg"
          frameCount={136}
        />

        <Sequence
          ref={(ref: Sequence) => (this.loop = ref)}
          key="loop"
          baseUrl="apps/concordia/loop/Appel_Pakken_Frank_2_"
          fileExtention=".jpg"
          frameCount={136}
          speed={0.5}
        />
      </div>
    );
  }
}
