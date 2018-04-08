import React = require("react");
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
  @observable private currentInteractive?: Sequence;
  @observable private interactivePointing: Sequence;
  @observable private interactiveLooking: Sequence;
  @observable public active: boolean = false;

  private overlay: any;

  public componentDidMount() {
    this.active = true;
    this.interactivePointing.pause();
    this.interactiveLooking.pause();
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
    if (this.currentInteractive) {
      return;
    }
    this.currentInteractive =
      Math.random() > 0.5 ? this.interactiveLooking : this.interactivePointing;
    console.log(this.currentInteractive);
    this.currentInteractive.visible = true;
    this.loop.visible = false;
    this.loop.pause();
  };

  public stopInteraction = () => {
    if (this.currentInteractive) {
      this.currentInteractive.visible = false;
      this.currentInteractive = undefined;
      this.loop.visible = true;
      this.loop.currentFrame = 0;
      this.loop.playLoop();
    }
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
    if (
      this.currentInteractive &&
      blob.id === IPMIFramework.Tracking.getBlobs()[0].id
    ) {
      const frameCount = this.currentInteractive.frameCount - 1;
      const calcCurrentFrame = Math.floor(
        this.currentInteractive.frameCount * (1 - blob.centroid.x)
      );
      this.currentInteractive.currentFrame = Math.min(
        frameCount,
        Math.max(0, calcCurrentFrame)
      );
      console.log(this.currentInteractive.currentFrame);
    }
  };

  public render() {
    return (
      <div>
        <Sequence
          ref={(ref: Sequence) => (this.interactiveLooking = ref)}
          key="interactiveLooking"
          baseUrl="apps/concordia/interactive/kijken/Kijken_Frank_Final_"
          numsize="00000"
          fileExtention=".jpg"
          frameCount={120}
        />

        <Sequence
          ref={(ref: Sequence) => (this.interactivePointing = ref)}
          key="interactivePointing"
          baseUrl="apps/concordia/interactive/wijzen/Wijzen_Frank_Final_"
          numsize="00000"
          fileExtention=".jpg"
          frameCount={105}
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
