import React, { useEffect, useState } from "react";
import Row from "../components/UI/Row";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";

import css from "./Controls.module.css";
import $ from "jquery";

let hueIP = "10.88.111.4"; // doesn't have to be static - line 22
let hueID = "5Jxz2vHdPje6989HwUeJRlEnUSZigG4E89ryIkdG"; // doesn't have to be static - line 31

const Controls = () => {
  const [color, setColor] = useState(15000);
  const [saturation, setSaturation] = useState(256);
  const [brightness, setBrightness] = useState(256);
  const [info, setInfo] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [lamp, setLamp] = useState({
    NAME: "No Lamp Selected",
    ID: "N/A",
    TYPE: "N/A",
  });

  useEffect(() => {
    // Getting Bridge IP

    if (!hueIP) {
      //making sure user didn't hardcode the value
      $.ajax({
        url: "https://discovery.meethue.com/",
        type: "get",
      })
        .done((data) => {
          hueIP = data[0].internalipaddress;
        })
        .fail((err) => {
          console.log(err);
          if (err.status === 429) {
            alert(
              "The HTTP 429 Error\n\nToo Many Requests response status code indicates the user has sent too many requests in a given amount of time ('rate limiting')."
            );
          }
        });
    }

    // Getting USER ID (will require user to hit the button)
    if (!hueID) {
      // making sure user didn't hardcode the value
      const getUserURL = `http://${hueIP}/api/`;
      $.ajax({
        url: getUserURL,
        type: "post",
        data: JSON.stringify({
          devicetype: toString(Math.floor(Math.random() * 254)),
        }),
      }).done((data) => {
        if (data[0].error.type === 101) {
          alert(
            "Error code 101, link button not pressed \n\nMake sure you click the link button on your router and reload the page."
          );
        } else if (data[0].success) {
          hueID = data[0].success.username;
          alert("User ID Added");
        } else {
          alert(
            `Uncaught Error ${data[0].error.description} \n\nMake sure you click the link button on your router and reload the page.`
          );
        }
      });
    }

    // Getting all the lights for this user/bridge
    const url = `http://${hueIP}/api/${hueID}`;
    $.getJSON(url)
      .done((responseText) =>
        setInfo({
          Values: Object.values(responseText.lights),
          Keys: Object.keys(responseText.lights),
        })
      )
      .fail(() => console.log("Failed to get Hue Data"));
  }, []);

  function send(obj) {
    var url =
      "http://" + hueIP + "/api/" + hueID + "/lights/" + lamp.ID + "/state/";
    $.ajax({
      url: url,
      type: "PUT",
      data: JSON.stringify(obj),
    });
  }

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
    setSaturation(+e.target.value);
    TurnAny();
  };

  const openModal = () => {
    console.log(info);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const selectLight = (e) => {
    setLamp({
      ID: info.Keys[
        info.Values.findIndex((value) => value.name === e.target.innerText)
      ],
      NAME: info.Values.find((value) => value.name === e.target.innerText).name,
      TYPE: info.Values.find((value) => value.name === e.target.innerText).type,
    });
    closeModal();
  };
  return (
    <div className={css.Controls}>
      {modalOpen ? (
        <Modal onClick={closeModal}>
          {info.Values.map((value) => (
            <Button key={value.name} value={value.name} onClick={selectLight}>
              {value.name}
            </Button>
          ))}
        </Modal>
      ) : (
        ""
      )}
      <Row title="Selected Lamp to Control">
        <h3>
          Current Lamp:{" "}
          <span className={css.lamp}>
            {lamp.NAME}(id: {lamp.ID})
          </span>{" "}
          <br />
          Lamp Type: <span className={css.lamp}>{lamp.TYPE}</span>{" "}
        </h3>
        <Button onClick={openModal}>Choose Hue Light</Button>
      </Row>
      {/* Custom Format Control */}
      {lamp.TYPE !== "Dimmable light" && lamp.NAME !== "No Lamp Selected" && (
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
      )}
      {/* ON/OFF */}
      {lamp.NAME !== "No Lamp Selected" && (
        <Row title="ON/OFF Switch" className={css.item1}>
          <Button onClick={turnOn}>ON</Button>
          <Button onClick={turnOff}>OFF</Button>
        </Row>
      )}

      {/* Color Temp */}
      {lamp.NAME !== "No Lamp Selected" && (
        <Row title="Temperature" className={css.item3}>
          <Button onClick={turnCooler}>Cold</Button>
          <Button onClick={turnCool}>Semi-Cold</Button>
          <Button onClick={turnWarm}>Semi-Warn</Button>
          <Button onClick={turnWarmer}>Warm</Button>
        </Row>
      )}

      {/* Brightness */}
      {lamp.NAME !== "No Lamp Selected" && (
        <Row title="Brightness" className={css.item4}>
          <Button onClick={bri25}>25%</Button>
          <Button onClick={bri50}>50%</Button>
          <Button onClick={bri75}>75%</Button>
          <Button onClick={bri100}>100%</Button>
        </Row>
      )}

      {/* Pre-selected Colors */}
      {lamp.TYPE !== "Dimmable light" && lamp.NAME !== "No Lamp Selected" && (
        <Row title="Colors" className={css.item2}>
          <Button onClick={turnRed}>Red</Button>
          <Button onClick={turnOrange}>Orange</Button>
          <Button onClick={turnYellow}>Yellow</Button>
          <Button onClick={turnGreen}>Green</Button>
          <Button onClick={turnBlue}>Blue</Button>
          <Button onClick={turnPurple}>Purple</Button>
          <Button onClick={turnPink}>Pink</Button>
        </Row>
      )}

      {lamp.TYPE !== "Dimmable light" && lamp.NAME !== "No Lamp Selected" && (
        <Row title="Other Functions">
          <Button onClick={Random}>Random</Button>
          <Button onClick={Disco}>Disco</Button>
        </Row>
      )}
    </div>
  );
};

export default Controls;
