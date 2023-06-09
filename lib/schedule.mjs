import fs from "fs";
import jsonToXlsx from "json-as-xlsx";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isScheduleExist = async () => {
  let schedule = new Promise((resolve, rejected) => {
    fs.readFileSync("data/schedule.json", "utf-8", (err, data) => {
      if (err) {
        ctx.reply("jadwal tidak ditemukan");
        rejected("error when load data/schedule.json");
        return;
      }
      resolve(JSON.parse(data));
    });
  });

  try {
    await schedule;
    return true;
  } catch (error) {
    return false;
  }
};

const getSchedule = () => {
  const schedulePath = path.join(__dirname, "..", "data", "schedule.json");
  if (fs.existsSync(schedulePath)) {
    const require = createRequire(import.meta.url);
    const schedule = require("../data/schedule.json");

    return schedule;
  } else {
    return {};
  }
};

const createScheduleXLSX = () => {
  const schedule = getSchedule();

  if (!fs.existsSync("downloads")) {
    fs.mkdirSync("downloads");
  }

  let data = [];

  if (schedule.length > 0) {
    data = [
      {
        sheet: "jadwal",
        columns: [
          {
            label: "Mata Kuliah",
            value: "name",
          },
          {
            label: "Jam",
            value: "time",
          },
          {
            label: "Dosen",
            value: "lecturer",
          },
          {
            label: "LMS",
            value: "link",
          },
        ],
        content: schedule,
      },
    ];

    let settings = {
      fileName: "downloads/jadwal", // Name of the resulting spreadsheet
      extraLength: 3, // A bigger number means that columns will be wider
      writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
      writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
      RTL: true, // Display the columns from right-to-left (the default value is false)
    };

    jsonToXlsx(data, settings);
  }
};

export { isScheduleExist, getSchedule, createScheduleXLSX };
