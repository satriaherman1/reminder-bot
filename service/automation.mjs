import puppeteer, { Dialog } from "puppeteer";
import { mapDataToJson } from "../lib/format.mjs";
import { createUserData } from "../lib/user.mjs";
import { createScheduleXLSX } from "../lib/schedule.mjs";

export class Automation {

  async init() {

  }

  async inputUsername(username) {

  }

  async inputPassword(password) {

  }

  async getImageCaptcha() {

  }

  async inputCaptcha(captcha) {

  }

  async login() {

  }

  /**
   * Mendapatkan data jadwal dari halaman jadwal siama unisnu
   * @param {*} userId 
   */
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
