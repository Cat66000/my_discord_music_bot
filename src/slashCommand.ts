import { APIApplicationCommandPermission } from "discord-api-types/v9";
import {
  BaseApplicationCommandOptionsData,
  CacheType,
  CommandInteraction,
} from "discord.js";
import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
} from "discord.js/typings/enums";
import { bot_owner_id, guild_ids } from "./loadedConfig";
import { MusicSubscription, subscriptions } from "./music/subscription";

export interface IApplicationCommandProperties {
  type: ApplicationCommandTypes;
  name: string;
  description: string;
  options?: [
    BaseApplicationCommandOptionsData & { type: ApplicationCommandOptionTypes },
  ];
  default_permission?: boolean;
}

export interface IOtherProps {
  admin?: boolean;
  global?: boolean;
}
export class BaseSlashCommand implements IOtherProps {
  public readonly properties: IApplicationCommandProperties;
  public readonly permissions: APIApplicationCommandPermission[];
  public readonly admin: boolean;
  public readonly global: boolean;

  constructor(
    APIProperties: Omit<IApplicationCommandProperties, "type">,
    { admin, global }: IOtherProps,
    permissions?: APIApplicationCommandPermission[],
  ) {
    this.properties = APIProperties as IApplicationCommandProperties;
    this.properties.type = 1;

    this.admin = admin;
    this.global = global;

    this.permissions = permissions || [];

    if (admin) {
      this.permissions.push({ id: bot_owner_id, type: 2, permission: true });
    }
  }

  preExec(interaction: CommandInteraction): Promise<void> {
    if (this.admin && interaction.member.user.id !== bot_owner_id) {
      return interaction.reply(
        "Cette commande est réservée à la propriétaire du bot, tu ne peux pas l'utiliser",
      );
    }

    if (!guild_ids.includes(interaction.guildId)) {
      return interaction.reply(
        "Ce serveur n'est pas autorisé à utiliser les commandes du bot\nSi cela n'est pas normal/prévu, veuillez contacter la propriétaire du bot",
      );
    }

    return this.prepare(interaction);
  }

  prepare(interaction: CommandInteraction) {
    return this.execute(interaction);
  }

  execute(interaction: CommandInteraction): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export class MusicSlashCommand extends BaseSlashCommand {
  constructor(
    APIProperties: Omit<IApplicationCommandProperties, "type">,
    otherProps?: IOtherProps,
    permissions?: APIApplicationCommandPermission[],
  ) {
    super(APIProperties, otherProps, permissions);
  }

  prepare(interaction: CommandInteraction): Promise<void> {
    let subscription = subscriptions.get(interaction.guildId);

    return this.execute(interaction, subscription);
  }

  // @ts-ignore
  execute(
    interaction: CommandInteraction,
    subscription: MusicSubscription,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export class AdminSlashCommand extends BaseSlashCommand {
  constructor(
    APIProperties: Omit<IApplicationCommandProperties, "type">,
    permissions?: APIApplicationCommandPermission[],
  ) {
    super(APIProperties, { admin: true, global: true }, permissions);
  }
}
