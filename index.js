const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// simple in-memory storage (free)
let users = {};

app.get("/", (req, res) => {
  res.send("Instagram bot running");
});

// webhook verification
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "my_verify_token";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// receive messages
app.post("/webhook", (req, res) => {
  const entry = req.body.entry?.[0];
  const messaging = entry?.messaging?.[0];

  if (!messaging) {
    return res.sendStatus(200);
  }

  const senderId = messaging.sender.id;
  const text = messaging.message?.text?.toLowerCase() || "";

  if (!users[senderId]) {
    users[senderId] = { step: 0 };
  }

  let reply = "";

  // conversation flow
  if (users[senderId].step === 0) {
    reply = "🔥 What are you trying to build right now?";
    users[senderId].step = 1;
  } else if (users[senderId].step === 1) {
    reply =
      "Got it. I help people start digital income systems. Want the fast dropshipping blueprint?";
    users[senderId].step = 2;
  } else if (users[senderId].step === 2 && text.includes("yes")) {
    reply =
      "Perfect. The dropshipping PDF + setup videos are $29. Pay and send screenshot here, I’ll unlock Telegram access.";
    users[senderId].step = 3;
  } else if (users[senderId].step === 3) {
    reply =
      "Access confirmed. Here’s your private Telegram channel: https://t.me/+Mg00Iw6hjahmZTNl ";
    users[senderId].step = 4;
  } else {
    reply = "Cool. Let me know when you’re ready to move.";
  }

  console.log("Reply:", reply);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
