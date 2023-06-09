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

  automation.init().then(()=> {
    ctx.reply('Silahkan masukan username untuk memulai menggunakan bot ini: ') 
  })
});

bot.command("atur_pengingat", (ctx) => {
  runScheduler()
});


bot.hears(/.*/, (ctx) => {
  const step = ctx?.session?.step;
  const message = ctx.message.text;
  
  if(step === "input_username") {
    console.log('mendapatkan username dari user: ' +  message);
    automation.inputUsername(message)
    ctx.reply('Silahkan masukan password anda: ')
    ctx.session.step = 'input_password'
  } else if (step === 'input_password'){
    console.log('mendapatkan password dari user: ' + message)
    
    // automation.inputPassword(message)
    automation.inputPassword(Buffer.from(message, 'base64').toString())
    ctx.session.step = 'input_captcha'
    automation.getImageCaptcha().then((imageUrl)=> {
      ctx.sendPhoto(imageUrl)
      ctx.reply('Silahkan masukan captcha:')
    })
  } else if (step === 'input_captcha') {
    ctx.reply('Data berhasil di terima, tunggu sebentar system sedang mencoba login...')
    automation.inputCaptcha(message)
      .then(() => automation.login())
      .then(() => automation.getScheduleData(ctx.message.from.id))
      .then(()=> { 
        ctx.replyWithDocument({ source: "downloads/jadwal.xlsx" })
        ctx.reply(`Jadwal telah di dapatkan, silahkan jalankan perintah /atur_pengingat untuk mengatur pengingat.`)
       })
  }
});

bot.launch()

export { bot };
