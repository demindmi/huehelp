let URL;

const getPhilipsHueIp = async () => {
  try {
    let res = await fetch("https://discovery.meethue.com/");
    let data = await res.json(); // convert to JSON format
    return data[0].internalipaddress;
  } catch (err) {
    console.error("getPhilipsHueIp", err);
    return null;
  }
};

const getHueUserId = async (hueIP) => {
  try {
    let res = await fetch(`http://${hueIP}/api/`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        devicetype: Math.random().toString(),
      }),
    });
    let data = await res.json(); // convert to JSON format
    return data[0].success.username;
  } catch (err) {
    console.error("getHueUserId", err);
    return null;
  }
};

const getPhilipsHueLights = async (hueIP, hueID) => {
  try {
    URL = `http://${hueIP}/api/${hueID}/lights/`;
    let res = await fetch(URL);
    let data = await res.json(); // convert to JSON format
    let lampsArray = Object.values(data).map((light, i) => {
      light.key = +Object.keys(data)[i];
      return light;
    });
    return lampsArray;
  } catch (err) {
    console.error("getPhilipsHueLights", err);
    return null;
  }
};

const updateLamp = async (lamp, options) => {
  try {
    let res = await fetch(`${URL}${lamp.key}/state/`, {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify(options),
    });
    let data = await res.json();
    return data;
  } catch (err) {
    console.error("getPhilipsHueLights", err);
  }
};

const getLamps = async () => {
  let hueIP = "10.88.111.4";
  let hueID = "5Jxz2vHdPje6989HwUeJRlEnUSZigG4E89ryIkdG";

  let lamps;
  if (!hueIP) {
    hueIP = await getPhilipsHueIp();
  }
  if (!hueID) {
    hueID = await getHueUserId(hueIP);
  }
  lamps = await getPhilipsHueLights(hueIP, hueID);
  return lamps;
};

const PhillipsHue = { updateLamp, getLamps };
export default PhillipsHue;
