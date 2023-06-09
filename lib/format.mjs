import fs from "fs";

const getLinkData = (str) => {
  const regex = /<a\s+href="([^"]*)"/i;
  const match = str.match(regex);

  if (match !== null) {
    const href = match[1];

    return href;
  } else {
    console.log('Tidak ditemukan tag <a href="...">.');
    return str;
  }
};

const getDateFromString = (str) => {
  const regex = /^([\w\s]+),\s([\d:]+)-([\d:]+)/;
  const result = str.match(regex);

  if (result) {
    const [_, day, start, end] = result;
    return result[0];
  } else {
    console.log("String tidak sesuai format");
    return str;
  }
};

const mapDataToJson = (data) => {
  const dataPath = "data/schedule.json";

  const dataArr = [];

  for (let i = 0; i < data.length; i++) {
    const obj = {
      id: data[i][0],
      time: getDateFromString(data[i][1]),
      code: data[i][2],
      name: data[i][3],
      sks: data[i][4],
      class: data[i][5],
      lecturer: data[i][6].trim(),
      room_code: data[i][7].trim(),
      link: getLinkData(data[i][8].trim()),
    };
    dataArr.push(obj);
  }

  const jsonData = JSON.stringify(dataArr);

  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }

  fs.writeFileSync(dataPath, jsonData, { flag: "w" });
  console.log("data was stored in data/schedule.json");
};

const truncateText = (text, len) => {
  if (text.length <= len) {
    return text;
  }

  text = text.slice(0, len) + "..";

  return text;
};

const getNumberOfDay = (day) => {
  let numberDay;

  switch (day.toLowerCase()) {
    case "senin":
      numberDay = 1;
      break;
    case "selasa":
      numberDay = 2;
      break;
    case "rabu":
      numberDay = 3;
      break;
    case "kamis":
      numberDay = 4;
      break;
    case "jumat":
      numberDay = 5;
      break;
    case "sabtu":
      numberDay = 6;
      break;
    case "minggu":
      numberDay = 0;
      break;
    default:
      numberDay = -1;
  }

  return numberDay;
};

export { mapDataToJson, truncateText, getNumberOfDay };
