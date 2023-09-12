const Discord = require("discord.js");
const talkedRecently = new Set();

const player = require("../../handlers/player");

const configs = require("../../configuration/settings.json");
const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");

module.exports = {
  name: "disconnect",
  category: "music",
  description: "Leaves the voice channel",
  usage: "disconnect",
  run: async (client, message, args, ops) => {
    if (message.author.bot) return;

    if (talkedRecently.has(message.author.id)) {
      const er = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle("Woah there, calm down senpai!")
        .setDescription(
          emojis.Sip +
            "Please wait  `5 seconds` before using the command again!"
        )
        .setTimestamp()
        .setFooter(
          configs.prefix +
            "disconnect" +
            " | " +
            "Requested by " +
            message.member.user.tag
        );

      return message.reply({ embeds: [er] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });
    } else {
      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 5000);
    }

    const err = new Discord.MessageEmbed()
      .setColor(colors.info)
      .setTitle(configs.err_title_music + " " + emojis.Sip)
      .setDescription(
        "Silly senpai~ you can't disconnect me If I'm not in a voice channel."
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    if (!message.guild.me.voice.channel) {
      return message.reply({ embeds: [err] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
      });
    }

    const success = new Discord.MessageEmbed()
      .setColor(colors.success)
      .setTitle("Disconnected " + emojis.Hype)
      .setDescription(
        "Senpai~ I've successfully disconnected from the following voice channel: ```" +
          message.member.voice.channel.name +
          "```"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    message.reply({ embeds: [success] });

    const queue = player.getQueue(message.guild);
    if (queue) queue.destroy(true);
  },
};
