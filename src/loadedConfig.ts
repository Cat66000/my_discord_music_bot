// @ts-ignore
import { config as loadConfig } from "dotenv";

const dotenvResult = loadConfig();
if (dotenvResult.error) throw dotenvResult.error;

const botToken: string = process.env.BOT_TOKEN;
const mainGuildId: string = process.env.MAIN_GUILD_ID;

const googleapisToken: string = process.env.GOOGLEAPIS_TOKEN;

if (!botToken || !mainGuildId || !googleapisToken) {
  throw "An environment variable is missing";
}

export { botToken, googleapisToken, mainGuildId };
