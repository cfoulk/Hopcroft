import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { createForumPost } from "./createForumPost.js";
import { CronJob } from "cron";

const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  const job = new CronJob(
    "0 * * * * *",
    () => {
      createForumPost(client);
    },
    null,
    true,
    "utc"
  );
});

client.login(token);
