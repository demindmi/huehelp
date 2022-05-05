import React, { useReducer } from "react";
import LampContext from "./LampContext";
import PhillipsHue from "../../services/philipsHueCalls";
import { logDOM } from "@testing-library/react";

const defaultLampsState = {
  LAMPS: [],
  LAMP_INDEX: 0,
};

const LampsReducer = (state, action) => {
  // let selectedLamp = [];
  // let lamps = {};

  switch (action.type) {
    case "GET_LAMPS":
      return { ...state, LAMPS: action.payload };

    case "LAMP_CONTROL":
      if (state.LAMPS) {
        PhillipsHue.updateLamp(
          state.LAMPS[state.LAMP_INDEX],
          action.options
        ).then((data) => console.log(data));
      }
      return { ...state };

    case "SELECT_LAMP":
      console.log(action);
      if (action.lampIndex > 0) {
        return { ...state, LAMP_INDEX: action.lampIndex };
      } else {
        alert("Can't select item with negative index ", action.lampIndex);
      }
      break;

    default:
      return state;
  }

  // console.log(lamps);
  // console.log("New State at the end:");
  // return {
  //   LAMPS: lamps,
  //   LAMP: selectedLamp,
  // };
};

const LampProvider = (props) => {
  const [LampsState, dispatchLampAction] = useReducer(
    LampsReducer,
    defaultLampsState
  );
  const lampControlHandler = (options) => {
    dispatchLampAction({ type: "LAMP_CONTROL", options: options });
  };

  const getLampsHandler = async () => {
    let payload = await PhillipsHue.getLamps();
    dispatchLampAction({ type: "GET_LAMPS", payload: payload });
  };

  const selectLampHandler = (index) => {
    dispatchLampAction({ type: "SELECT_LAMP", lampIndex: index });
  };

  const lampsContext = {
    // LAMP: [LampsState.LAMP],
    // LAMPS: [LampsState.LAMPS],
    STATE: LampsState,
    SELECT_LAMP: selectLampHandler,
    GET_LAMPS: getLampsHandler,
    LAMP_CONTROL: lampControlHandler,
  };

  return (
    <LampContext.Provider value={lampsContext}>
      {props.children}
    </LampContext.Provider>
  );
};

export default LampProvider;
