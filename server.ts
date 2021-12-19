import dayjs from "dayjs";
import express, { Request, Response } from "express";
import { scheduleJob } from "node-schedule";
import { Telegraf, Context } from "telegraf";
import axios from "axios";
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

bot.telegram.sendMessage(
  process.env.MY_TELEGRAM_CHAT_ID ?? 2048189240,
  `Jarvis Bot is started`
);

app.get("/hello", (req: Request, res: Response) => {
  res.send("hello");
});

app.post("/telegramMsg", (req: Request, res: Response) => {
  const { alertDate, alertText } = req.body;
  if (alertDate && alertText) {
    const date = new Date(alertDate);
    scheduleJob(date, function () {
      console.log(`It's times to do event ${alertText}`);
      bot.telegram.sendMessage(
        process.env.MY_TELEGRAM_CHAT_ID ?? 2048189240,
        `喂！夠鐘做 ${alertText}`
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

app.post("/well-saying", async (req: Request, res: Response) => {
  try {
    const { data: dictData } = await axios.get(
      `${process.env.TIAN_API}/dictum/index?key=${process.env.TIAN_KEY}&num=1`
    );
    const message = {
      to: process.env.APP_EXPO_TOKEN,
      sound: "default",
      title: "溫馨提示",
      body: `${dictData.newslist[0].content} --- ${dictData.newslist[0].mrname}`,
      data: { someData: "goes here" },
    };
    const expoRes = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      message,
      {
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      }
    );
    res.send("Post Success!!!");
  } catch (err) {
    console.log("post Expo notification failed: ", err);
    res.status(400).send("post Expo notification failed");
  }
});

app.listen(port, () => {
  console.log("Server Start at port", port);
});
