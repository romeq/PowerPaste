import { checkReputation } from "../helpers"
import { Logger } from "../utils/logger"
import { PasteSchema } from "../schemas"
import { Model, model } from "mongoose"
import config from "../config"
import { RequestHandler } from "express"

type RequestParams = Parameters<RequestHandler>

class Routes {
    criticalLogger?: Logger
    logger?: Logger
    PasteModel: Model<any>
    unknown_author: {
        name: string;
        avatar: string;
    }

    constructor() {
        this.criticalLogger = new Logger(true, true)
        this.logger = new Logger(true, false)
        this.PasteModel = model("Paste", PasteSchema)
        this.unknown_author = config.unknown_author || {
            name: "Tuntematon",
            avatar: "https://images.unsplash.com/photo-1534294668821-28a3054f4256?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
        }

        if (!this.PasteModel) this.criticalLogger.error(`Unable to initialize PasteModel`)
    }

    sendErrorResponse(
        res: any, 
        status: number,
        title: string,
        message: string,
        additionalfields?: {}[]
    ) {
        return res.status(status).send({
            title: title,
            message: message,
            data: additionalfields,
        })
    }

    async checkClientReputation(req: RequestParams[0], res: RequestParams[1], next) {
        if (config.abuseipdb_key) {
            const reputation = JSON.parse(await checkReputation(req.ip, config.abuseipdb_key))

            if ("errors" in reputation) {
                reputation.errors.forEach((error: string) => {
                    this.logger?.error("AbuseIPDB", error)
                })
            } else {
                if (reputation.data.abuseConfidenceScore > 60) {
                    return this.sendErrorResponse(
                        res,
                        403,
                        "Pääsy hylätty",
                        "IP-osoitteesi maine on huono, joten hylkäsimme pyyntösi uuden liitteen luomiseksi."
                    )
                }
            }
        }
        next()
    }
}

export { Routes }
