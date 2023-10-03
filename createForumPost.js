"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createForumPost = void 0;
require("dotenv/config");
const problem_1 = require("./problem");
async function createForumPost(client) {
    const forum = client.channels.cache.get(process.env.FORUM_CHANNEL_ID);
    const result = await (0, problem_1.postProblem)();
    if (result !== undefined) {
        const { title, link } = result;
        const messageOptions = {
            content: "@everyone \n" + title + "\n" + link,
        };
        const date = new Date().toLocaleDateString('en-us', { month: "short", day: "numeric" });
        forum.threads
            .create({
            name: "Problem of the Day: " + date,
            autoArchiveDuration: 60,
            reason: "Problem of the Day to remind people for badges!",
            message: messageOptions,
        })
            .then((threadChannel) => console.log(threadChannel))
            .catch(console.error);
    }
    else {
        return "error fetch problem";
    }
}
exports.createForumPost = createForumPost;
