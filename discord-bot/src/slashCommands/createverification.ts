import { SlashCommand } from "../types";
import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonStyle  } from "discord.js";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";


const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("createverification")
        .setDescription("Creates a verification channel [ADMIN ONLY]")
        .addStringOption(option => option.setName("title").setDescription("Title of the embed").setRequired(true))
        .addStringOption(option => option.setName("description").setDescription("Description of the embed").setRequired(true))
        .addChannelOption(option => option.setName("channel").setDescription("Channel to send the embed in").setRequired(true))
        .addBooleanOption(option => option.setName("button").setDescription("Add a button to the embed")),
    execute: async (interaction) => {
        // @ts-ignore
        const channel = interaction.options.getChannel("channel")
        // @ts-ignore
        const title = interaction.options.getString("title")
        // @ts-ignore
        const description = interaction.options.getString("description")
        // @ts-ignore
        const button = interaction.options.getBoolean("button")
        if(interaction.member != null) {
            const memberPermissions =  interaction.member.permissions
            // @ts-ignore
            if(memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                if(button){
                    const embed = new EmbedBuilder()
                        .setTitle(title)
                        .setDescription(description)
                    const button = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("verify")
                                .setLabel("Verify")
                                .setStyle(ButtonStyle.Primary)
                        )
                    channel.send({embeds: [embed], components: [button]})
                    interaction.reply({content: "Embed sent", ephemeral: true})
                        } else {
                            await interaction.reply({
                                content: "You need to add a button to the embed",
                                ephemeral: true
                            })
                        }
            }
        }

    }
}

export default command;

