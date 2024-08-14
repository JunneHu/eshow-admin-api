const ChapterService = require("../service/chapter");
// const AipSpeechClient = require("baidu-aip-sdk").speech;
// const HttpClient = require("baidu-aip-sdk").HttpClient;

// 设置APPID/AK/SK
const APP_ID = "17084622";
const API_KEY = "tGDuXsjth4pOF9AEGzwIR1PG";
const SECRET_KEY = "Vo4yHgPrnQFXKdpHQmZTzukeMCzojAm1";

class ChapterController {
    static async add(ctx) {
        let req = ctx.request.body;
        if (req.title && req.content && req.isFree && req.bookId) {
            try {
                const ret = await ChapterService.addChapter(req);
                ctx.response.status = 200;
                ctx.body = {
                    code: '0',
                    message: "成功"
                }
            } catch (err) {
                ctx.response.status = 200;
                ctx.body = {
                    code: '-1',
                    message: "失败",
                    data: err
                }
            }
        } else {
            ctx.response.status = 200;
            ctx.body = {
                code: '-2',
                message: "参数不全"
            }
        }
    }
    static async getList(ctx) {
        const params = ctx.request.query;
        try {
            let data = await ChapterService.getList(params);

            ctx.response.status = 200;
            return ctx.body = {
                code: '0',
                message: "成功",
                data: data
            }
        } catch (error) {
            ctx.response.status = 200;
            ctx.body = {
                code: '-1',
                message: "失败",
                data: error
            }
        }
    }
    static async delete(ctx) {
        let id = ctx.params.id;
        if (id) {
            try {
                const query = await ChapterService.getChapter(id);
                if (!query) {
                    ctx.response.status = 200;
                    ctx.body = {
                        code: '-1',
                        message: "id不存在"
                    }
                } else {
                    const ret = await ChapterService.delete(id);
                    ctx.response.status = 200;
                    ctx.body = {
                        code: '0',
                        message: "成功"
                    }
                }
            } catch (err) {
                ctx.response.status = 200;
                ctx.body = {
                    code: '-1',
                    message: "失败",
                    data: err
                }
            }
        } else {
            ctx.response.status = 200;
            ctx.body = {
                code: '-2',
                message: "参数不全"
            }
        }
    }
    static async read(ctx) {
        let text = ctx.request.body.text;
        if (text) {
            // https://openapi.baidu.com/oauth/2.0/token
        } else {
            ctx.response.status = 200;
            ctx.body = {
                code: '-2',
                message: "参数不全"
            }
        }
    }
}
module.exports = ChapterController;