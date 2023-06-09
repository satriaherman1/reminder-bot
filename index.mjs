import { Telegraf, session } from "telegraf";
import { Automation } from "./service/automation.mjs";
import { runScheduler } from "./service/scheduler.mjs";

const BOT_TOKEN = 'YOUR BOT TOKEN HERE';
const bot = new Telegraf(BOT_TOKEN);
const automation = new Automation()

bot.use(session());

bot.start((ctx) => {
  ctx.session = {
    step: 'input_username'
  }
});

bot.command("atur_pengingat", (ctx) => {

});


bot.hears(/.*/, (ctx) => {

});

bot.launch()

export { bot };
