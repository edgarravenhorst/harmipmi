import * as React from "react";
import Video from "./components/video";
import Orkest1 from "./apps/orkest1";
import Orkest2 from "./apps/orkest2";
import Orkest3 from "./apps/orkest3";
import Sonnevanck from "./apps/sonnevanck";
import TheaterMakers from "./apps/theatermakers";
import Concordia from "./apps/concordia";

import { observable } from "mobx";
import { observer } from "mobx-react";

import { Redirect, Route, Switch } from "react-router-dom";

@observer
class App extends React.Component {
  @observable private finished = false;
  @observable private currentIndex: number = 5;
  private appTimeout: any;

  private apps = [
    { duration: 10 * 60 * 1000, url: "/orkest1", component: <Orkest1 /> },
    { duration: 10 * 60 * 1000, url: "/orkest2", component: <Orkest2 /> },
    { duration: 10 * 60 * 1000, url: "/orkest3", component: <Orkest3 /> },
    { duration: 10 * 60 * 1000, url: "/sonnevanck", component: <Sonnevanck /> },
    { duration: 10 * 60 * 1000, url: "/concordia", component: <Concordia /> },
    { duration: 10 * 60 * 1000, url: "/theatermakers", component: <TheaterMakers /> }
  ];

  public componentWillMount() {
    this.selectApp(this.currentIndex);
  }

  public componentDidMount() {
    const index = this.currentIndex;
    this.appTimeout = setTimeout(() => this.selectApp(this.currentIndex + 1), this.apps[index].duration);
    window.addEventListener("click", () => {
      this.selectApp(this.currentIndex + 1);
    });
  }

  private selectApp(index: number) {
    if (index > this.apps.length - 1) {
      index = 0;
    }

    if (index < 0) {
      index = this.apps.length - 1;
    }

    this.currentIndex = index;

    clearTimeout(this.appTimeout);
    this.appTimeout = setTimeout(
      () => this.selectApp(index + 1),
      this.apps[this.apps.length > index ? index : 0].duration
    );
  }

  public render() {
    return this.apps[this.currentIndex].component;
  }
}

export default App;
