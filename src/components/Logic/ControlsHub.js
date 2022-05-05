import React, { useEffect, useState, useContext } from "react";
import Row from "../UI/Row";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import LampContext from "../Store/LampContext";

import css from "./ControlsHub.module.css";

const ControlsHub = () => {
  const [color, setColor] = useState(15000);
  const [saturation, setSaturation] = useState(256);
  const [brightness, setBrightness] = useState(256);
  const [modalOpen, setModalOpen] = useState(false);
  const [options, setOptions] = useState({
    colormode: "",
    hue: 0,
  });

  const ctx = useContext(LampContext);
  const currentLamp = ctx.STATE.LAMPS[ctx.STATE.LAMP_INDEX];
  const delay = 300; //determines delay in mss for sending the updates to hue (default 3)

  useEffect(() => {
    ctx.GET_LAMPS();
  }, []);

  // limiting user interactions
  useEffect(() => {
    const commandDelay = setTimeout(() => {
      if (options) {
        console.log(options);
        ctx.LAMP_CONTROL(options);
      }
    }, delay);

    return () => {
      clearTimeout(commandDelay);
      console.log("Clean up");
    };
  }, [options]);

  // function toggle() {
  //   send({ on: !lamp.ON });
  //   setLamp({ ...lamp, ON: !lamp.ON });
  // }

  // function turnOn() {
  //   send({ on: true });
  //   setLamp({ ...lamp, ON: true });
  // }

  // function turnOff() {
  //   send({ on: false });
  //   setLamp({ ...lamp, ON: false });
  // }

  // function turnRed() {
  //   send({ colormode: "hue", hue: 8000, sat: 254 });
  // }

  // function turnOrange() {
  //   send({ colormode: "hue", hue: 16000, sat: 254 });
  // }

  // function turnYellow() {
  //   send({ colormode: "hue", hue: 20000, sat: 254 });
  // }
  // function turnGreen() {
  //   send({ colormode: "hue", hue: 26000, sat: 254 });
  // }
  // function turnBlue() {
  //   send({ colormode: "hue", hue: 44000, sat: 254 });
  // }
  // function turnPurple() {
  //   send({ colormode: "hue", hue: 48400, sat: 254 });
  // }
  // function turnPink() {
  //   send({ colormode: "hue", hue: 58000, sat: 254 });
  // }

  // function bri25() {
  //   send({ bri: 64 });
  // }
  // function bri50() {
  //   send({ bri: 128 });
  // }
  // function bri75() {
  //   send({ bri: 190 });
  // }
  // function bri100() {
  //   send({ bri: 254 });
  // }

  // function turnCooler() {
  //   send({ colormode: "ct", ct: 154 });
  // }
  // function turnCool() {
  //   send({ colormode: "ct", ct: 270 });
  // }
  // function turnWarm() {
  //   send({ colormode: "ct", ct: 385 });
  // }
  // function turnWarmer() {
  //   send({ colormode: "ct", ct: 500 });
  // }

  // function Disco() {
  //   send({ effect: "colorloop" });
  // }

  // function Random() {
  //   let hueX = Math.floor(Math.random() * 65536) + 1;
  //   let satX = Math.floor(Math.random() * 254) + 1;
  //   let briX = Math.floor(Math.random() * 254) + 1;
  //   send({ colormode: "hue", hue: hueX, sat: satX, bri: briX });
  // }

  // const TurnAny = () => {
  //   send({ colormode: "hue", hue: color, sat: saturation, bri: brightness });
  // };

  // const autoColor = (e) => {
  //   setColor(+e.target.value);
  //   TurnAny();
  // };

  // const autoBright = (e) => {
  //   setBrightness(+e.target.value);
  //   TurnAny();
  // };

  // const autoSat = (e) => {
  //   setSaturation(+e.target.value);
  //   TurnAny();
  // };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // const selectLight = (e) => {
  //   let indexOfLight = info.findIndex(
  //     (value) => value.name === e.target.innerText
  //   );
  //   setLamp({
  //     ID: info[indexOfLight].key,
  //     NAME: info[indexOfLight].name,
  //     TYPE: info[indexOfLight].type,
  //     ON: info[indexOfLight].state.on,
  //   });
  //   closeModal();
  // };

  // const pickLight = (e) => {
  //   console.log("Pick light called from Controls Hub");
  //   let indexOfLight = ctx.LAMPS.findIndex(
  //     (value) => value.name === e.target.innerText
  //   );
  //   // console.log("here");
  //   // !DONT FORGET TO FIX THIS, should be  ctx.SELECT_LAMP(indexOfLight);
  //   ctx.SELECT_LAMP(indexOfLight);
  // };

  const getIndex = (e) => {
    const INDEX = ctx.STATE.LAMPS.findIndex(
      (value) => value.name === e.target.innerText
    );
    ctx.SELECT_LAMP(INDEX);
    console.log(ctx.SELECT_LAMP(INDEX));
    closeModal();
  };

  return (
    <div className={css.ControlsHub}>
      {modalOpen ? (
        <Modal onClick={closeModal}>
          {ctx.STATE.LAMPS.map((value) => (
            <Button
              key={value.name}
              value={value.name}
              onClick={(e) => getIndex(e)}>
              {value.name}
            </Button>
          ))}
          <Button onClick={ctx.LAMP_CONTROL.bind(null, { on: true })}>
            test
          </Button>
        </Modal>
      ) : (
        ""
      )}
      {ctx.STATE.LAMPS.length > 0 && (
        <Row title="Selected Lamp to Control">
          <h3>
            Current Lamp:{" "}
            <span className={css.lamp}>
              {currentLamp.name}(id: {currentLamp.key})
            </span>{" "}
            <br />
            Lamp Type: <span className={css.lamp}>{currentLamp.type}</span>{" "}
          </h3>
          <Button onClick={openModal}>Choose Hue Light</Button>
        </Row>
      )}
      {ctx.STATE.LAMPS.length > 0 &&
        currentLamp.type !== "Dimmable light" &&
        currentLamp.name !== "No Lamp Selected" && (
          <Row title="Custom Format">
            <div>
              <label label="Color" htmlFor="color">
                <span className={css.label}>Color (1-65501)</span>
                <span className={css.value}>{options.hue}</span>
              </label>
              <input
                id="color"
                step="500"
                type="range"
                min="1"
                max="65501"
                onChange={(event) =>
                  setOptions({
                    colormode: "hue",
                    hue: +event.target.value,
                  })
                }
                value={options.hue}></input>
            </div>
            {/* <div>
              <label label="Color" htmlFor="color">
                <span className={css.label}>Saturation (16-256)</span>
                <span className={css.value}>{saturation}</span>
              </label>
              <input
                id="color"
                step="16"
                type="range"
                min="16"
                max="256"
                // onChange={autoSat}
                value={saturation}></input>
            </div>
            <div>
              <label label="bright" htmlFor="bright">
                <span className={css.label}>Brightness (16-256)</span>
                <span className={css.value}>{brightness}</span>
              </label>
              <input
                id="bright"
                step="16"
                type="range"
                min="16"
                max="256"
                // onChange={autoBright}
                value={brightness}></input>
            </div> */}
          </Row>
        )}

      {/* Custom Format Control */}
    </div>
  );
};

export default ControlsHub;
