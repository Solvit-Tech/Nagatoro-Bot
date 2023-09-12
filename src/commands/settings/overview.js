const Guild = require("../../models/guild");
const Discord = require("discord.js");

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "overview",
  category: "settings",
  description: "Shows the servers configurations",
  usage: `overview`,
  run: async (client, message, args) => {
    const err = new Discord.MessageEmbed()

      .setColor(colors.error)
      .setTitle(configs.missing_title_moderation + " " + emojis.Hmm)
      .setDescription(
        `**Silly senpai~ you don't have permission to view server settings. (MANAGE_GUILD)**`
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
      return message.reply({ embeds: [err] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });

    const settings = await Guild.findOne(
      {
        guildID: message.guild.id,
      },
      (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          message.reply({ contents: err });
        }
      }
    );

    const success = new Discord.MessageEmbed()
      .setColor(colors.info)
      .setTitle("Configurations" + " " + emojis.Giggle)
      .setDescription(
        "Hey Senpai~ here's your current server (" + message.guild.name + ") configurations:"
      )
      .addField(
        emojis.Tag + " Welcome Logs",
        "<#" + settings.welcomechannelId + ">",
        true
      )
      .addField(
        emojis.Tag + " Moderation Logs",
        "<#" + settings.logchannelId + ">",
        true
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    const settingsconfirm = await Guild.findOne(
      {
        guildID: message.guild.id,
      },
      (err, guild) => {
        if (err) console.error(err);
        if (guild) {
          return;
        }
      }
    );
    if (settingsconfirm) message.reply({ embeds: [success] });
  },
};
