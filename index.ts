import 'dotenv/config';
import { Client, Events, GatewayIntentBits, Constants } from 'discord.js';
import { createForumPost } from './createForumPost';

const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);

client.on('ready',() => {
    // console.log(client);
    createForumPost(client);
});

