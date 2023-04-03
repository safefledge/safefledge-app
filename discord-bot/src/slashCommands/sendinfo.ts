import { SlashCommand } from "../types";
import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonStyle  } from "discord.js";
import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";


const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("sendembed")
        .setDescription("Sends an embed [ADMIN ONLY]")
        .addStringOption(option => option.setName("title").setDescription("Title of the embed").setRequired(true))
        .addStringOption(option => option.setName("description").setDescription("Description of the embed").setRequired(true))
        .addChannelOption(option => option.setName("channel").setDescription("Channel to send the embed in").setRequired(true))
        .addBooleanOption(option => option.setName("button").setDescription("Add a button to the embed")),
    execute: async (interaction) => {
        if(interaction.member != null) {
           const memberPermissions =  interaction.member.permissions
          // @ts-ignore
          if(memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
            // @ts-ignore
            const title = interaction.options.getString("title")
            // @ts-ignore
            const description = interaction.options.getString("description")
            // @ts-ignore
            const channel = interaction.options.getChannel("channel")
            // @ts-ignore
            const button = interaction.options.getBoolean("button")
            if(button) {
                let button = new ActionRowBuilder()
                button.addComponents(
                    new ButtonBuilder()
                    .setCustomId("jointeam")
                    .setLabel("Join Team")
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Join Team")
                )
                let embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                channel.send({embeds: [embed], components: [button]})
                interaction.reply({content: "Embed sent", ephemeral: true})
            }
            let embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
            channel.send({embeds: [embed]})
            interaction.reply({content: "Embed sent", ephemeral: true})
        } else {
            interaction.reply({content: "You don't have permission to use this command", ephemeral: true})
        }
    }
}
}



export default command;