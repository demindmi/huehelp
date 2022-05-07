import React, { useReducer } from "react";
import LampContext from "./LampContext";
import PhillipsHue from "../../services/philipsHueCalls";

const defaultLampsState = {
  LAMPS: [],
  LAMP_INDEX: -1,
};
const LampsReducer = (state, action) => {
  switch (action.type) {
    case "GET_LAMPS":
      return { ...state, LAMPS: action.payload };

    case "UPDATE_LAMP":
      if (state.LAMPS) {
        PhillipsHue.updateLamp(
          state.LAMPS[state.LAMP_INDEX],
          action.options
        ).then((data) => console.log("returned from Lamp : ", data));
      }
      return { ...state };

    case "SELECT_LAMP":
      if (action.lampIndex > 0) {
        return { ...state, LAMP_INDEX: action.lampIndex };
      } else {
        alert("Can't select item with negative index ", action.lampIndex);
      }
      break;

    default:
      return state;
  }
};

const LampProvider = (props) => {
  const [LampsState, dispatchLampAction] = useReducer(
    LampsReducer,
    defaultLampsState
  );
  const updateLampHandler = (options) => {
    dispatchLampAction({ type: "UPDATE_LAMP", options: options });
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
    LAMP_CONTROL: updateLampHandler,
  };

  return (
    <LampContext.Provider value={lampsContext}>
      {props.children}
    </LampContext.Provider>
  );
};

export default LampProvider;
