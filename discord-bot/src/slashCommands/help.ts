import { SlashCommand } from "../types";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";



const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows a list of all commands"),
    execute: async (interaction) => {
        let embed = new EmbedBuilder()
            .setTitle("All commands")
            .addFields(
                interaction.client.slashCommands.map(command => {
                    return {
                        name: command.command.name,
                        value: command.command.description
                    }
                })
            )
        interaction.reply({embeds: [embed]})
    }
}


export default command;