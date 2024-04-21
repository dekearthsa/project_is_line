"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllerLine = void 0;
const { request: Req } = require('express');
const { response: Res } = require('express');
const line = require("@line/bot-sdk");
const path = require("path");
const fs = require('fs');
// const {Datastore} = require('@google-cloud/datastore');
require('dotenv').config({ path: path.resolve(__dirname, "../../.env") });
// const datastore = new Datastore();
const CONFIG = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};
const LINE_CLIENT = new line.Client(CONFIG);
const downloadContent = (messageId, downloadPath) => {
    return LINE_CLIENT.getMessageContent(messageId)
        .then((stream) => new Promise((resolve, reject) => {
        const writable = fs.createWriteStream(downloadPath);
        stream.pipe(writable);
        stream.on('end', () => resolve(downloadPath));
        stream.on('error', reject);
    }));
};
const controllerLine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.events[0].replyToken;
    try {
        if (req.body.events[0].message.type === "image") {
            const date = new Date();
            const ms = date.getTime();
            const setRdNum = String((Math.random() * 100000).toFixed(0));
            const isDownloadPath = `image_${ms}_${setRdNum}.png`;
            let getContent = yield downloadContent(req.body.events[0].message.id, isDownloadPath);
            const fileBuff = fs.readFileSync(getContent);
            const base64Data = fileBuff.toString('base64');
            const warpImg = {
                data: base64Data
            };
            const echo = { type: "text", text: JSON.stringify(warpImg) };
            return LINE_CLIENT.replyMessage(token, echo);
        }
        else {
            const echo = { type: "text", text: "ระบบไม่รองรับข้อความ ใส่รูปภาพ digital e-slip เพื่อทำการเก็บข้อมูลลงใน database" };
            return LINE_CLIENT.replyMessage(token, echo);
        }
    }
    catch (err) {
        console.log(err);
        const echo = { type: "text", text: JSON.stringify(err) };
        return LINE_CLIENT.replyMessage(token, echo);
    }
});
exports.controllerLine = controllerLine;
