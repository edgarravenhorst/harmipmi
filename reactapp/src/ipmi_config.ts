const IPMI = require("./lib/ipmi.js");

export const ipmiConfig = {
  tracking: {
    hostaddr: "ipmi.wirelab.nl",
    hostport: 4000,
    hostpath: "/secret/internal",
    method: IPMI.TrackingMethod.TSPS
    //  method: IPMI.TrackingMethod.Mouse,
    //pointerTarget: document.querySelector("#root")
  }
};
