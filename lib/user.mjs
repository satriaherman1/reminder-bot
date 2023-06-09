import fs from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUserData = (userId) => {
  if (!fs.existsSync("data")) {
    fs.mkdirSync("data");
  }
  const dataPath = "data/user.json";

  const data = {
    userId,
  };
  
  const jsonData = JSON.stringify(data);

  fs.writeFileSync(dataPath, jsonData, { flag: "w" });
};

const getUserData = () => {
  const userDataPath = path.join(__dirname, "..", "data", "user.json");

  if (fs.existsSync(userDataPath)) {
    const require = createRequire(import.meta.url);
    const userData = require("../data/user.json");

    return userData;
  } else {
    return {};
  }
};

export { createUserData, getUserData };
