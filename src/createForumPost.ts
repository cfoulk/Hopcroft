import 'dotenv/config';
import {
    Client,
    ForumChannel,
    TextChannel,
    ThreadAutoArchiveDuration,
} from 'discord.js';
import { postProblem } from './problems.js';

export async function createForumPost(client: Client) {
    const forum = client.channels.cache.get(
        process.env.FORUM_CHANNEL_ID as string,
    ) as ForumChannel;

    const result = await postProblem();
    if (result !== undefined) {
        const { title, link, difficulty, tags } = result;

        const guild = client.guilds.cache.get(process.env.SERVER_ID);
        const myRole = guild.roles.cache.find(role => role.name === process.env.ROLE_NAME);
        console.log(`Found the role ${myRole.name}`);
        const tempMessage = `@here ${myRole}\n${title}\n${link} \n\nReact with a 🚀!\n**Difficulty**: ${difficulty}\n**Tags**:${tags.map((t) => ` ${t}`)}`;

        const date = new Date().toLocaleDateString('en-us', {
            month: 'short',
            day: 'numeric',
        });
        forum.threads
            .create({
                name: 'Problem of the Day: ' + date,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
                message: { content: tempMessage },
                reason: 'Problem of the Day to remind people for badges!',
            })
            .then((forum) => {
                forum.lastMessage.react('🚀');
                console.log(
                    new Date().toLocaleTimeString('en-us') + ': Message Posted!',
                );
            })
            .catch(console.error);
    } else {
        return 'error fetch problem';
    }
}
