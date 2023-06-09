import cron from "node-cron";
import { bot } from "../index.mjs";
import { getNumberOfDay } from "../lib/format.mjs";
import { getSchedule } from "../lib/schedule.mjs";
import { getUserData } from "../lib/user.mjs";

const runScheduler = () => {
  const schedule = getSchedule();
  const userData = getUserData();

  if (schedule.length > 0 && Object.keys(userData).length > 0) {
    const { userId } = userData;
    const timeArr = schedule.map((s) => {
      return {
        time: s.time,
        link: s.link,
        name: s.name,
      };
    });

    timeArr.forEach(({ time, link, name }) => {
      // berfungsi untuk memparsing data dari jadwal yang sudah kita terima
      // data `time` berupa `Jumat, 22:49-23:00`
      const day = time.split(", ")[0]; // mengambil data hari, di case ini berarti text `Jumat`
      const hourSchedule = time.split(", ")[1].split("-")[0]; // mengambil data jam pelajaran di mulai, di case ini berarti `22:49`
      const dayCode = getNumberOfDay(day.toLowerCase()); // merubah data text hari `Jumat` menjadi day of the week, di case ini berarti `5`, day of the week terdiri dari hari minggu=0,senin=1,selasa=2,rabu=3,kamis=4,jumat=5,sabtu=6

      const hour = hourSchedule.split(":")[0]; // mengambil data jam, di case ini berarti `22`
      const minute = hourSchedule.split(":")[1]; // mengambil data menit, di case ini berarti `49`

      const cronExpression = `TODO: buat cron expression menggunakan data di atas`

      cron.schedule(cronExpression, () => {
        console.log('reminder sent')
        bot.telegram.sendMessage(userId, `waktunya absen ${name}`, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Langsung absen",
                  url: link,
                },
              ],
            ],
          },
        });
      });
      console.log(`cron expression ${cronExpression}`)
    });
    bot.telegram.sendMessage(userId, "Pengingat telah diatur");
  }
};

export { runScheduler };
