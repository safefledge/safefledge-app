import { Client, GatewayIntentBits, ActivityType, Collection, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, InteractionType, EmbedBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import {config} from "dotenv";
import fs from "fs";
import path from "path";
import slashHandler from "./handlers/Command";
import eventHandler from "./handlers/Event";
import {SlashCommand} from "./types";


config();


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping]});
client.slashCommands = new Collection<string, SlashCommand>()

client.on("ready", () => {
    if(!client.user || !client.application) return;

    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{
            name: "SkyGuardian | /help",
            type: ActivityType.Watching
        }]
    })
})

client.on("interactionCreate", async (interaction) => {
    if(interaction.isButton()) {
    if(interaction.customId === "jointeam"){
        const modal = new ModalBuilder()
            .setCustomId("joinTeam")
            .setTitle("Join SkyGuardian Team")
            // @ts-ignore
            .addComponents([
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("position")
                            .setLabel("Position")
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder("What position are you applying for? Positions: Frontend Developer, Backend Developer, UI/UX Designer")
                            .setMinLength(1)
                            .setMaxLength(100)
                            .setRequired(true)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("experience")
                            .setLabel("Experience")
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder("What experience do you have?")
                            .setMinLength(1)
                            .setMaxLength(100)
                            .setRequired(true)
                    )
            ])
        await interaction.showModal(modal)
    } else if(interaction.customId === "verify"){
        const role = interaction.guild?.roles.cache.find(role => role.id === "1090403519795834890")
        if(role) {
            // @ts-ignore
            interaction.member?.roles.add(role)
            interaction.reply({content: "You have been verified!", ephemeral: true})
        } else {
            interaction.reply({content: "There is no role called `Verified`", ephemeral: true})
        }
    } else if(interaction.customId === "accept"){
        // @ts-ignore
        const thread = interaction.channel
        const list = client.guilds.cache.get("1089955891241037945")
        // @ts-ignore
        const member = list?.members.cache.find(member => member.user.username + member.user.discriminator === thread?.name.split(" - ")[0].replace("#", ""))
        if(member) {
            const embed = new EmbedBuilder()
                .setTitle("Application Accepted")
                .setDescription("Your application has been accepted! You will be contacted soon!")
            member.send({embeds: [embed]})
            interaction.reply({content: "Application accepted! The user has been notified! Contact them in the thread!", ephemeral: true})
        } else {
            interaction.reply({content: "There is no user with that tag", ephemeral: true})
        }
    } else if(interaction.customId === "deny"){
        // @ts-ignore
        const thread = interaction.channel
        // @ts-ignore
        const list = client.guilds.cache.get("1089955891241037945")
        // @ts-ignore
        const member = list?.members.cache.find(member => member.user.username + member.user.discriminator === thread?.name.split(" - ")[0].replace("#", ""))
        if(member) {
            const embed = new EmbedBuilder()
                .setTitle("Application Denied")
                .setDescription("Your application has been denied!")
                member.send({embeds: [embed]})
        } else {
            interaction.reply({content: "There is no user with that tag", ephemeral: true})
        }
    }
} else if(interaction.type === InteractionType.ModalSubmit){
    if(interaction.customId === "joinTeam"){
        const user = interaction.user
        const position = interaction.fields.getTextInputValue("position")
        const experience = interaction.fields.getTextInputValue("experience")
        ///create new thread and send message
        const channel = interaction.guild?.channels.cache.get('1090394914069688421')
        if(channel) {
            // @ts-ignore
           channel.threads.create({
                name: `${user.tag} - ${position}`,
                autoArchiveDuration: 1440,
                reason: "Application for SkyGuardian Team",
                message: {
                    content: `**User:** ${user.tag} (${user.id})\n**Position:** ${position}\n**Experience:** ${experience}`
                }
            })
            // send embed to thread
            const embed = new EmbedBuilder()
                .setTitle("Application")
                .setDescription("Do you want to accept this application?")
            const acceptButton = new ButtonBuilder()
                .setCustomId("accept")
                .setLabel("Accept")
                .setStyle(ButtonStyle.Success)
            const denyButton = new ButtonBuilder()
                .setCustomId("deny")
                .setLabel("Deny")
                .setStyle(ButtonStyle.Danger)
            const actionRow = new ActionRowBuilder()
                .addComponents(acceptButton, denyButton)
            setTimeout(() => {
                // @ts-ignore
                channel.threads.cache.find(x => x.name === `${user.tag} - ${position}`).send({embeds: [embed], components: [actionRow]})
            }, 5000)
            interaction.reply({content: "Your application has been sent!", ephemeral: true})
        } else {
            interaction.reply({content: "There is no channel called `applications`", ephemeral: true})
        }
    }
}
})



slashHandler(client);

eventHandler(client);



client.login(process.env.TOKEN);

