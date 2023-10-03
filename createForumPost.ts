import "dotenv/config";
import {
    Client,
    GuildForumThreadManager,
    ThreadAutoArchiveDuration,
    FetchedThreads,
    Events,
    GatewayIntentBits,
    Constants,
    MessagePayload,
    TextChannel,
    GuildForumThreadMessageCreateOptions,
} from "discord.js";
import { postProblem } from "./problem";

export async function createForumPost(client: Client) {
    const forum: TextChannel = client.channels.cache.get(
        process.env.FORUM_CHANNEL_ID as string,
    ) as TextChannel;

    const result = await postProblem();
    if (result !== undefined) {
        const { title, link } = result;
        const messageOptions: GuildForumThreadMessageCreateOptions =  {
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
} else {
    return "error fetch problem";
}
}
