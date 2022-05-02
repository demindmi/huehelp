import React, { useEffect, useState } from "react";
import Row from "../components/UI/Row";
import Button from "../components/UI/Button";

import css from "./Controls.module.css";
import $ from "jquery";

var hueIP = "10.88.111.4"; // Your hue bridge IP
var hueID = "5Jxz2vHdPje6989HwUeJRlEnUSZigG4E89ryIkdG"; // Get your ID from the hue bridge// var hueLamp = "13" // the lamp to comtrol

const Controls = () => {
  const [color, setColor] = useState(15000);
  const [saturation, setSaturation] = useState(256);
  const [brightness, setBrightness] = useState(256);
  const [info, setInfo] = useState(null);

  const GetInfo = () => {
    // $.getJSON("https://www.meethue.com/api/nupnp", function (data) {
    //   console.log(data);
    // });

    const url = `http://${hueIP}/api/${hueID}`;
    $.getJSON(url, function (responseText) {
      setInfo(responseText);
    });
    const getUserURL = `http://${hueIP}/api/`;
    $.ajax({
      url: getUserURL,
      type: "post",
      data: JSON.stringify({ devicetype: "test" }),
    }).then((data) => {
      if (data.error) console.log(data);
    });
  };

  function send(obj) {
    const hueLamp = 16;
    var url =
      "http://" + hueIP + "/api/" + hueID + "/lights/" + hueLamp + "/state/";
    $.ajax({
      url: url,
      type: "PUT",
      data: JSON.stringify(obj),
    });
  }

  useEffect(() => {
    GetInfo();
  }, []);

  function turnOn() {
    send({ on: true });
  }

  function turnOff() {
    send({ on: false });
  }

  function turnRed() {
    send({ colormode: "hue", hue: 8000, sat: 254 });
  }

  function turnOrange() {
    send({ colormode: "hue", hue: 16000, sat: 254 });
  }

  function turnYellow() {
    send({ colormode: "hue", hue: 20000, sat: 254 });
  }
  function turnGreen() {
    send({ colormode: "hue", hue: 26000, sat: 254 });
  }
  function turnBlue() {
    send({ colormode: "hue", hue: 44000, sat: 254 });
  }
  function turnPurple() {
    send({ colormode: "hue", hue: 48400, sat: 254 });
  }
  function turnPink() {
    send({ colormode: "hue", hue: 58000, sat: 254 });
  }

  function bri25() {
    send({ bri: 64 });
  }
  function bri50() {
    send({ bri: 128 });
  }
  function bri75() {
    send({ bri: 190 });
  }
  function bri100() {
    send({ bri: 254 });
  }

  function turnCooler() {
    send({ colormode: "ct", ct: 154 });
  }
  function turnCool() {
    send({ colormode: "ct", ct: 270 });
  }
  function turnWarm() {
    send({ colormode: "ct", ct: 385 });
  }
  function turnWarmer() {
    send({ colormode: "ct", ct: 500 });
  }

  function Disco() {
    send({ effect: "colorloop" });
  }

  function Random() {
    let hueX = Math.floor(Math.random() * 65536) + 1;
    let satX = Math.floor(Math.random() * 254) + 1;
    let briX = Math.floor(Math.random() * 254) + 1;
    send({ colormode: "hue", hue: hueX, sat: satX, bri: briX });
  }

  const TurnAny = () => {
    send({ colormode: "hue", hue: color, sat: saturation, bri: brightness });
  };

  const autoColor = (e) => {
    setColor(+e.target.value);
    TurnAny();
  };

  const autoBright = (e) => {
    setBrightness(+e.target.value);
    TurnAny();
  };

  const autoSat = (e) => {
    console.log(e.target.value);
    setSaturation(+e.target.value);
    TurnAny();
  };

  return (
    <div className={css.Controls}>
      <Row title="Custom Format">
        <div>
          <label label="Color" htmlFor="color">
            <span className={css.label}>Color (1-65501)</span>
            <span className={css.value}>{color}</span>
          </label>
          <input
            id="color"
            step="500"
            type="range"
            min="1"
            max="65501"
            onChange={autoColor}
            value={color}></input>
        </div>

        <div>
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
            onChange={autoSat}
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
            onChange={autoBright}
            value={brightness}></input>
        </div>
      </Row>

      <Row title="ON/OFF Switch" className={css.item1}>
        <Button onClick={turnOn}>ON</Button>
        <Button onClick={turnOff}>OFF</Button>
      </Row>

      <Row title="Temperature" className={css.item3}>
        <Button onClick={turnCooler}>Cold</Button>
        <Button onClick={turnCool}>Semi-Cold</Button>
        <Button onClick={turnWarm}>Semi-Warn</Button>
        <Button onClick={turnWarmer}>Warm</Button>
      </Row>

      <Row title="Brightness" className={css.item4}>
        <Button onClick={bri25}>25%</Button>
        <Button onClick={bri50}>50%</Button>
        <Button onClick={bri75}>75%</Button>
        <Button onClick={bri100}>100%</Button>
      </Row>

      <Row title="Colors" className={css.item2}>
        <Button onClick={turnRed}>Red</Button>
        <Button onClick={turnOrange}>Orange</Button>
        <Button onClick={turnYellow}>Yellow</Button>
        <Button onClick={turnGreen}>Green</Button>
        <Button onClick={turnBlue}>Blue</Button>
        <Button onClick={turnPurple}>Purple</Button>
        <Button onClick={turnPink}>Pink</Button>
      </Row>

      <Row title="Colors">
        <Button onClick={Random}>Random</Button>
        <Button onClick={Disco}>Disco</Button>
      </Row>
    </div>
  );
};

export default Controls;
