import { Client, CommandInteraction, Intents } from "discord.js";
import { commands, loadCommands } from "./commands";
import { command } from "./commands/ping";
import { bot_token } from "./loadedConfig";
import { RestLoadingApplicationCommands } from "./rest";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

async function init() {
  console.log('Loading commands inside "commands" dir');
  await loadCommands();
  console.log("Commands successfully loaded");

  console.log("Started reloading application (/) commands.");
  await RestLoadingApplicationCommands();
  console.log("Successfully reloaded application (/) commands.");

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on("interactionCreate", async (interaction) => {
    try {
      if (!interaction.isCommand()) return;

      try {
        const { commandName } = interaction;
        if (!commands.has(commandName)) {
          await interaction.reply(
            `Une erreur étrange est survenue, je n'ai pas trouvé la commande au nom de ${commandName} dans mon code o_O`,
          );
        }

        const command = commands.get(commandName);

        await command.execute(interaction);
      } catch (error) {
        await interactionErrorHandler(interaction, error);
      }
    } catch (error2) {
      console.error(error2);
    }
  });

  async function interactionErrorHandler(
    interaction: CommandInteraction,
    error: Error,
  ) {
    console.error(error);
  }

  await client.login(bot_token);
}

init();
