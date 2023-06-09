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
      const day = time.split(", ")[0];
      const hourSchedule = time.split(", ")[1].split("-")[0];
      const dayCode = getNumberOfDay(day.toLowerCase());

      const hour = hourSchedule.split(":")[0];
      const minute = hourSchedule.split(":")[1];

      const cronExpression = `${minute} ${hour} * * ${dayCode}`

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
