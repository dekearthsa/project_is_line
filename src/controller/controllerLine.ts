const { request: Req } = require('express')
const { response: Res } = require('express')
const line = require("@line/bot-sdk")
const path = require("path");
const fs = require('fs');
// const {Datastore} = require('@google-cloud/datastore');
require('dotenv').config({ path: path.resolve(__dirname, "../../.env") });
// const datastore = new Datastore();

const CONFIG = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
}

const LINE_CLIENT = new line.Client(CONFIG);

const downloadContent = (messageId:string, downloadPath:string) => {
    return LINE_CLIENT.getMessageContent(messageId)
    .then((stream:any) => new Promise((resolve, reject) => {
        const writable = fs.createWriteStream(downloadPath);
        stream.pipe(writable);
        stream.on('end', () => resolve(downloadPath));
        stream.on('error', reject);
    }));
}

const controllerLine = async (req: typeof Req, res: typeof Res) => {
    const token = req.body.events[0].replyToken;
    try{
        if(req.body.events[0].message.type === "image"){
            const date = new Date();
            const ms = date.getTime();
            const setRdNum = String((Math.random() * 100000).toFixed(0))
            const isDownloadPath = `image_${ms}_${setRdNum}.png`

            let getContent = await downloadContent(req.body.events[0].message.id, isDownloadPath);
            const fileBuff  = fs.readFileSync(getContent);
            const base64Data = fileBuff.toString('base64');
            
            const warpImg = {
                data: base64Data
            }
            const echo = {type: "text", text: JSON.stringify(warpImg)}
            return LINE_CLIENT.replyMessage(token, echo)

        }else{
            const echo = {type: "text", text: "ระบบไม่รองรับข้อความ ใส่รูปภาพ digital e-slip เพื่อทำการเก็บข้อมูลลงใน database"}
            return LINE_CLIENT.replyMessage(token, echo)
        }
    }catch(err){
        console.log(err)
        const echo = {type: "text", text: JSON.stringify(err)}
        return LINE_CLIENT.replyMessage(token, echo)
    }

}

export {controllerLine}

