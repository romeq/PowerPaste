import { RequestHandler, Router } from "express";
import { Routes } from "./router";

type RequestParams = Parameters<RequestHandler>

class Metrics extends Routes {
    router: Router

    constructor() {
        super()

        this.router = Router()
        this.router.get("/", this.getMetrics.bind(this))
    }

    private nopastes(res) {
        return this.sendErrorResponse(res, 404, "Liitteitä ei löytynyt", 
            "Emme ole vastaanottaneet vielä yhtäkään liitettä. Ole ensimmäinen!"
        )
    }

    async getMetrics(_: RequestParams[0], res: RequestParams[1]) {
        let pastes = undefined
       
        try {
            pastes = await this.PasteModel.find().select('meta.views hidden -_id')
            if (!pastes) return this.nopastes(res)
        } catch (err) { 
            return this.nopastes(res) 
        }

        let pasteCount = {
            total: 0,
            public: 0,
            private: 0,
        }

        const totalViews = pastes
            .map(paste => {
                pasteCount.total += 1
                if (paste.hidden) pasteCount.private += 1
                else pasteCount.public += 1

                return paste.meta?.views
            })
            .filter(views => views != null)
            .reduce((a: number, b: number) => a && b ? a + b : a, 0)
            

        res.send({
            "totalViews": totalViews,
            "pasteCount": pasteCount,
        });
    };

}


export { Metrics }