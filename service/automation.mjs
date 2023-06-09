import puppeteer, { Dialog } from "puppeteer";
import { mapDataToJson } from "../lib/format.mjs";
import { createUserData } from "../lib/user.mjs";
import { createScheduleXLSX } from "../lib/schedule.mjs";

export class Automation {
  browserlessToken = "2132b561-268c-47b0-bbfa-9a9915e6488b";

  async init() {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();
    this.page.setViewport({ width: 1400, height: 1080 });

    await this.page.goto("https://siama.unisnu.ac.id/");
    const loginButtonSelector =
      "#navbar-collapse > ul.nav.navbar-nav.pull-right.hidden-xs > li:nth-child(1) > a";
    await this.page.click(loginButtonSelector);
    this.listenToLoginError();
  }

  listenToLoginError() {
    this.page.on("dialog", async (dialog) => {
      console.log("login error");
    });
  }

  async inputUsername(username) {
    const usernameSelector = "#username";
    await this.page.type(usernameSelector, username, { delay: 1 });
  }

  async inputPassword(password) {
    const passwordSelector = "#password";
    await this.page.type(passwordSelector, password, { delay: 1 });
  }

  async getImageCaptcha() {
    const captchaImgParentSelector = "#img-captcha > img";
    const imageUrl = await this.page.$eval(
      captchaImgParentSelector,
      (el) => el.src
    );
    return imageUrl;
  }

  async inputCaptcha(captcha) {
    const captchaSelector = "#captcha";
    await this.page.type(captchaSelector, captcha, { delay: 1 });
  }

  async login() {
    const buttonLoginSelector = "#btnSimpanfLogin";
    await this.page.click(buttonLoginSelector);
  }

  async getScheduleData(userId) {
    const sidebarSelector =
      "#main_screen > aside > div > section > ul > li:nth-child(3) > a";
    const scheduleSelector =
      "#main_screen > aside > div > section > ul > li.menu.treeview.active > ul > li:nth-child(6) > a";
    const scheduleDropdown = "#tahunid";

    await this.page.waitForSelector(sidebarSelector);
    await this.page.click(sidebarSelector);
    setTimeout(async () => {
      await this.page.click(scheduleSelector);
    }, 1000);

    await this.page.waitForSelector(scheduleDropdown);
    const options = await this.page.$$eval(
      scheduleDropdown + " > option",
      (opt) => opt.map((o) => o.value)
    );

    const tahunAjaran = options[1];
    await this.page.select(scheduleDropdown, tahunAjaran);
    const trSelector = "#konten_isi > div:nth-child(3) > table > tbody > tr";

    await this.page.waitForSelector(trSelector);

    const scheduleData = await new Promise((resolve, rejected) => {
      setTimeout(async () => {
        // const trArr = await page.$$eval(trSelector, (el) => el.map((e) => e.innerHTML));
        const trArr = await this.page.$$(trSelector);
        const trDataArray = [];

        for (let i = 0; i < trArr.length; i++) {
          const tdDataArray = await trArr[i].$$eval("td", (tdElements) =>
            tdElements.map((tdElement) => tdElement.innerHTML)
          );

          trDataArray.push(tdDataArray);
        }

        resolve(trDataArray);
      }, 1000);
    });

    mapDataToJson(scheduleData)
    createUserData(userId);
    createScheduleXLSX();
  }
}
