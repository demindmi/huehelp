import React, { useEffect, useState, useContext } from "react";
import Row from "../UI/Row";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import LampContext from "../Store/LampContext";

import css from "./ControlsHub.module.css";

const ControlsHub = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [options, setOptions] = useState({});

  const ctx = useContext(LampContext);
  const currentLamp = ctx.STATE.LAMPS[ctx.STATE.LAMP_INDEX];
  const delay = 300; //determines delay in mss for sending the updates to hue (default 3)

  // limiting user interactions
  useEffect(() => {
    if (ctx.STATE.LAMPS.length > 0) {
      const commandDelay = setTimeout(() => {
        ctx.LAMP_CONTROL(options);
      }, delay);
      return () => {
        clearTimeout(commandDelay);
      };
    }
  }, [options]);

  useEffect(() => {
    ctx.GET_LAMPS();
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const settingsChangeHandler = (passedOptions) => {
    const fullOptions = { ...options, ...passedOptions };
    const { xy, on, ct, ...finalOptions } = { ...fullOptions };
    setOptions(finalOptions);
  };

  const randomStyle = () => {
    let hueX = Math.floor(Math.random() * 65536) + 1;
    let satX = Math.floor(Math.random() * 254) + 1;
    let briX = Math.floor(Math.random() * 254) + 1;
    settingsChangeHandler({
      colormode: "hue",
      hue: hueX,
      sat: satX,
      bri: briX,
    });
  };

  const getCurrentLamp = async (e) => {
    ctx.GET_LAMPS();
    const INDEX = ctx.STATE.LAMPS.findIndex(
      (value) => value.name === e.target.innerText
    );
    await ctx.SELECT_LAMP(INDEX);
    const { alert, mode, effect, colormode, reachable, ...temp } = {
      ...ctx.STATE.LAMPS[INDEX].state,
    };
    settingsChangeHandler(temp);
    closeModal();
  };

  return (
    <div className={css.ControlsHub}>
      {modalOpen && (
        <Modal onClick={closeModal} header="Discoverd Lights">
          {ctx.STATE.LAMPS.map((value) => (
            <Button
              key={value.name}
              value={value.name}
              onClick={(e) => getCurrentLamp(e)}>
              {value.name}
            </Button>
          ))}
        </Modal>
      )}
      {!currentLamp && (
        <Row title="LIGHT SELECTOR" className={css.mainButton}>
          <Button onClick={openModal}>LET'S GO!</Button>
        </Row>
      )}

      {currentLamp && (
        <Row title={currentLamp.name}>
          {currentLamp && (
            <h4>
              LAMP ID: <span className={css.lamp}>{currentLamp.key}</span>{" "}
              <br />
              LAMP TYPE: <span className={css.lamp}>
                {currentLamp.type}
              </span>{" "}
            </h4>
          )}
          <Button onClick={openModal}>CHOSE LAMP</Button>
          <Button onClick={() => ctx.GET_LAMPS()}> Get New Data </Button>
        </Row>
      )}

      {currentLamp && currentLamp.type !== "Dimmable light" && (
        <Row title="Custom Format">
          <div className={css.Format}>
            <label label="Color" htmlFor="color">
              <span className={css.label}>COLOR</span>
              <span className={css.value}>{options.hue}</span>
            </label>
            <input
              id="color"
              step="500"
              type="range"
              min="1"
              max="65501"
              className={css.slider}
              onChange={(event) =>
                settingsChangeHandler({
                  hue: +event.target.value,
                })
              }
              value={options.hue ?? ""}></input>
          </div>
          <div className={css.Format}>
            <label label="Color" htmlFor="color">
              <span className={css.label}>SATURATION</span>
              <span className={css.value}>{options.sat}</span>
            </label>
            <input
              id="color"
              step="4"
              type="range"
              min="4"
              max="252"
              className={css.slider}
              onChange={(event) =>
                settingsChangeHandler({
                  sat: +event.target.value,
                })
              }
              value={options.sat ?? ""}></input>
          </div>
          <div className={css.Format}>
            <label label="bright" htmlFor="bright">
              <span className={css.label}>BRIGHTNESS</span>
              <span className={css.value}>{options.bri}</span>
            </label>
            <input
              id="bright"
              step="4"
              type="range"
              min="4"
              max="252"
              className={css.slider}
              onChange={(event) =>
                settingsChangeHandler({
                  bri: +event.target.value,
                })
              }
              value={options.bri ?? ""}></input>
          </div>
        </Row>
      )}

      {currentLamp && (
        <>
          <Row title="ON/OFF Switch">
            <Button onClick={settingsChangeHandler.bind(null, { on: true })}>
              ON
            </Button>
            <Button onClick={settingsChangeHandler.bind(null, { on: false })}>
              OFF
            </Button>
          </Row>
          <Row title="Temperature">
            <Button
              onClick={settingsChangeHandler.bind(null, {
                colormode: "ct",
                ct: 154,
              })}>
              Cold
            </Button>
            <Button
              onClick={settingsChangeHandler.bind(null, {
                colormode: "ct",
                ct: 270,
              })}>
              Semi-Cold
            </Button>
            <Button
              onClick={settingsChangeHandler.bind(null, {
                colormode: "ct",
                ct: 385,
              })}>
              Semi-Warn
            </Button>
            <Button
              onClick={settingsChangeHandler.bind(null, {
                colormode: "ct",
                ct: 500,
              })}>
              Warm
            </Button>
          </Row>
          <Row title="Brightness">
            <Button onClick={settingsChangeHandler.bind(null, { bri: 64 })}>
              25%
            </Button>
            <Button onClick={settingsChangeHandler.bind(null, { bri: 128 })}>
              50%
            </Button>
            <Button onClick={settingsChangeHandler.bind(null, { bri: 190 })}>
              75%
            </Button>
            <Button onClick={settingsChangeHandler.bind(null, { bri: 254 })}>
              100%
            </Button>
          </Row>
        </>
      )}
      {/* Pre-selected Colors */}

      {currentLamp && currentLamp.type !== "Dimmable light" && (
        <>
          <Row title="Colors">
            <Button
              onClick={settingsChangeHandler.bind(null, {
                colormode: "hue",
                hue: 4000,
                sat: 254,
                bri: 254,
              })}>
              Red
            </Button>
            <Button
              onClick={settingsChangeHandler.bind(null, {
                colormode: "hue",
                hue: 8500,
                sat: 254,
                bri: 254,
              })}>
              Orange
            </Button>
            <Button
              onClick={settingsChangeHandler.bind(null, {
                colormode: "hue",
                hue: 17000,
                sat: 254,
                bri: 254,
              })}>
              Yellow
            </Button>
            <Button
              onClick={settingsChangeHandler.bind(null, {
                colormode: "hue",
                hue: 25500,
                sat: 254,
                bri: 254,
              })}>
              Green
            </Button>
            <Button
              onClick={settingsChangeHandler.bind(null, {
                colormode: "hue",
                hue: 41000,
                sat: 254,
                bri: 254,
              })}>
              Blue
            </Button>
            <Button
              onClick={settingsChangeHandler.bind(null, {
                colormode: "hue",
                hue: 48500,
                sat: 254,
                bri: 254,
              })}>
              Purple
            </Button>
            <Button
              onClick={settingsChangeHandler.bind(null, {
                colormode: "hue",
                hue: 58000,
                sat: 254,
                bri: 254,
              })}>
              Pink
            </Button>
          </Row>
          <Row title="Other Functions">
            <Button onClick={() => randomStyle()}>Random</Button>
            <Button
              onClick={settingsChangeHandler.bind(null, {
                effect: "colorloop",
              })}>
              Disco
            </Button>
          </Row>
        </>
      )}
    </div>
  );
};

export default ControlsHub;
