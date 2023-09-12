const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const configs = require("../../configuration/settings.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "ban",
  category: "moderation",
  description: "Bans a member",
  usage: "ban <@user> <reason>",
  run: async (client, message, args) => {
    if (message.author.bot) return;

    const err = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTimestamp()
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        emojis.Sip +
          `Silly senpai~ you don't have permission to ban members. (**BAN_MEMBERS**)`
      )
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS))
      return message.reply({ embeds: err }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    let server = message.guild.name.toString();
    let Target = message.mentions.users.first();

    const invalidmember = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `Silly senpai~ you need to mention a valid member of this server.`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!Target)
      return message
        .reply({
          embeds: [invalidmember],
          allowedMentions: { repliedUser: false },
        })
        .then((msg) => {
          setTimeout(() => msg.delete(), 15000);
        });

        const banSelf = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
        .setDescription(
          "Silly senpai~ why would you want to ban youself?"
        )
        .setTimestamp()
        .setFooter("Requested by " + message.member.user.tag);
  
    if (Target.id == message.author.id) return message.reply({ embeds: [banSelf] })

    let reason = args.slice(1).join(" ");

    const maxLength = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        "Sorry senpai~ Please make sure your reason is below `512` characters!"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (reason.length > 512) return message.reply({ embeds: [maxLength] })
    if (!reason) reason = "No reason was provided.";

    const embed = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle("You've been banned!")
      .setDescription(
        emojis.Hmm +
          " You've been banned from from `" +
          server.toString() +
          "` with the reason: ```" +
          reason.toString() +
          "```"
      )
      .setTimestamp()
      .setFooter("Responsible moderator: " + message.member.user.tag);

    Target.send({ embeds: [embed] }).catch(console.error)
    message.guild.members.cache.get(Target.id).ban({ reason: "Moderator: " + message.member.user.tag + " / Reason: " + reason })

    const logembed = new Discord.MessageEmbed()
      .setColor(colors.log)
      .setTitle(" ➜ Action || Ban")
      .addField("Moderator:", "<@!" + message.member.user.id + ">", true)
      .addField("Target:", "<@!" + Target.id.toString() + ">", true)
      .addField("Channel:", message.channel.toString(), true)
      .addField("Reason:", "```" + reason.toString() + "```", true)
      .setTimestamp();

    const Guild = require("../../models/guild");
    const settings = await Guild.findOne(
      {
        guildID: message.guild.id,
      },
      (err, guild) => {
        if (err) return console.error(err);
        if (guild) {
          console.log(guild);
        }
      }
    );

    let logchannel = message.guild.channels.cache.get(settings.logchannelId);
    logchannel.send({ embeds: [logembed] });
  },
};
