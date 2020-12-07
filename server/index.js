import express from "express";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();
const app = express();

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(allowCrossDomain);

app.get("/getToken", (req, res) => {
  if (!req.query || !req.query.userName || !req.query.room) {
    return res.status(400).send("Username/room parameter is required");
  }

  const accessToken = new AccessToken(
    process.env.ACCOUNT_SID,
    process.env.API_KEY_SID,
    process.env.API_KEY_SECRET
  );

  accessToken.identity = req.query.userName;

  var grant = new VideoGrant(req.query.room);
  accessToken.addGrant(grant);

  var jwt = accessToken.toJwt();
  return res.send(jwt);
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server started on port ${process.env.SERVER_PORT}`);
});
