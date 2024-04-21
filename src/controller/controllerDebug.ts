const { request: Req } = require('express')
const { response: Res } = require('express')

const controllerDebug = async (req: typeof Req, res: typeof Res) => {
    res.status(200).send("OK")
}

export {controllerDebug}

