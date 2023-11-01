import "dotenv/config";
import { Client, ForumChannel, ThreadAutoArchiveDuration } from "discord.js";
import { customProblem } from "./problems.js";

export const TIMEOUT = 3600000;
const TOTAL_ATTEMPTS = 1;
let attempts = 0;

const _capitalize = (inputString) => {
  if (!inputString.includes("-")) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  }
  return inputString.replace(
    /([a-z]+)-([a-z]+)/g,
    function (_, firstWord, secondWord) {
      return (
        firstWord.charAt(0).toUpperCase() +
        firstWord.slice(1) +
        " " +
        secondWord.charAt(0).toUpperCase() +
        secondWord.slice(1)
      );
    }
  );
};

export async function createForumPost(client: Client, forum: ForumChannel) {
  const dsaTopic = "linked-list";
  const result = await customProblem(dsaTopic);

  if (result !== undefined) {
    const { title, link, difficulty, tags } = result;

    const guild = client.guilds.cache.get(process.env.SERVER_ID);
    const myRole = guild.roles.cache.find(
      (role) => role.name === process.env.ROLE_NAME
    );

    const tempMessage = `@here ${myRole}\n${title}\n${link} \n\nReact with a 🚀!\n**Difficulty**: ${difficulty}\n**Tags**:${tags.map(
      (t) => ` ${t}`
    )}`;

    const date = new Date().toLocaleDateString("en-us", {
      month: "short",
      day: "numeric",
    });

    forum.threads
      .create({
        name: _capitalize(dsaTopic) + " Problem of the Day: " + date,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
        message: { content: tempMessage },
        reason:
          "Problem of the Day to remind people for custom topic " +
          _capitalize(dsaTopic),
      })
      .then((forum) => {
        forum.lastMessage.react("🚀");
      })
      .catch(console.error);
  } else {
    console.log("Error creating post");
    if (attempts < TOTAL_ATTEMPTS) {
      attempts++;
      setTimeout(() => {
        createForumPost(client, forum);
      }, TIMEOUT); // makes an attempt every hour for 20 hours
      console.log(
        "Attempt " + attempts + " at " + new Date().toLocaleTimeString("en-us")
      );
    } else {
      console.warn("All attempts exhausted.");
      attempts = 0;
    }
  }
}
