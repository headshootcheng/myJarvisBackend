import dayjs from "dayjs";
import express, { Request, Response } from "express";
import { scheduleJob } from "node-schedule";
import { Telegraf, Context } from "telegraf";
require("dotenv").config();

const bot = new Telegraf<Context>(process.env.BOT_TOKEN ?? "");
const app = express();
const port = process.env.PORT ?? 5000;
app.use(express.json());

// bot.launch();
bot.telegram.setWebhook(
  `https://my-jarvis-backend.herokuapp.com/bot${process.env.BOT_TOKEN}`
);
app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));

app.get("/hello", (req: Request, res: Response) => {
  console.log(process.env.MY_TELEGRAM_CHAT_ID, process.env.BOT_TOKEN);
  res.send("hello");
});

app.post("/telegramMsg", (req: Request, res: Response) => {
  const { alertDate, alertText } = req.body;
  if (alertDate && alertText) {
    const date = new Date(alertDate);
    scheduleJob(date, function () {
      bot.telegram.sendMessage(
        process.env.MY_TELEGRAM_CHAT_ID ?? 2048189240,
        `It's times to do event ${alertText}`
      );
    });
    res.send(
      `Created ${alertText} event alert at ${dayjs(date).format(
        "HH:mm DD/MM/YYYY"
      )}`
    );
    return;
  }
  res.status(400).send("Server Error !!!");
});

app.listen(port, () => {
  console.log("Server Start at port", port);
});
