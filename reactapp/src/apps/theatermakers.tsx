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
export default class TheaterMakers extends React.Component {
  @observable private anger: Sequence;
  @observable public active: boolean = false;

  private overlay: any;

  public componentDidMount() {
    IPMIFramework.Tracking.PersonEnteredSignal.add(this.onPersonEntered);
    IPMIFramework.Tracking.PersonUpdatedSignal.add(this.onPersonUpdate);
    IPMIFramework.Tracking.PersonLeftSignal.add(this.onPersonLeave);

    setInterval(() => {
      this.anger.currentFrame = this.anger.currentFrame === 0 ? 1 : 0;
    }, 300);
  }

  public componentWillUnmount() {
    IPMIFramework.Tracking.PersonEnteredSignal.removeAll();
    IPMIFramework.Tracking.PersonUpdatedSignal.removeAll();
    IPMIFramework.Tracking.PersonLeftSignal.removeAll();
  }

  public startInteraction = () => {
    /**/

    console.log(this.anger);
  };

  public stopInteraction = () => {
    /**/
  };

  private onPersonEntered = (blob: any) => {
    /**/
    this.startInteraction();
  };

  private onPersonLeave = (blob: any) => {
    /**/
  };

  private onPersonUpdate = (blob: any) => {
    /**/
  };

  public render() {
    return (
      <div style={{ backgroundImage: "apps/theatermakers/background.jpg" }}>
        <Sequence
          ref={(ref: Sequence) => (this.anger = ref)}
          key="scrubber"
          baseUrl="apps/theatermakers/emotion/01 anger"
          fileExtention=".png"
          frameCount={2}
          speed={1}
          numsize="0000"
          width={200}
          height={200}
        />
      </div>
    );
  }
}
