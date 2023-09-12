const { get } = require("request-promise-native");
const Discord = require("discord.js");

const colors = require("../../configuration/colors.json");
const emojis = require("../../configuration/emojis.json");
const configs = require("../../configuration/settings.json");

module.exports = {
  name: "anime",
  category: "info",
  aliases: ["kitsu"],
  description: "Get information about an anime",
  usage: "anime <anime_name>",
  run: (client, message, args) => {
   if (message.author.bot) return;

   const nsfwerr = new Discord.MessageEmbed()
   .setColor(colors.error)
   .setTitle(configs.missing_title_fun + emojis.Hmm)
   .setDescription(
     emojis.Sip +
       "Senpai~ This command searches can retrieve **NSFW content** and therefor is restricted to **NSFW channels!**"
   )
   .setTimestamp()
   .setFooter("Requested by " + message.member.user.tag);

 // if (!message.channel.nsfw) return message.reply({ embeds: [nsfwerr] });

    if (!args.length) {
      const errm = new Discord.MessageEmbed()
        .setColor(colors.error)
        .setTitle(configs.missing_title_fun + emojis.Hmm)
        .setDescription(
          emojis.Sip +
            "Which anime do you want me to search for again? \n Please mention a anime to search for silly senpai!"
        )
        .setTimestamp()
        .setFooter("Requested by " + message.member.user.tag);

      return message.reply({ embeds: [errm] });
    }

    let option = {
      url: `https://kitsu.io/api/edge/anime?filter[text]=${args.join(" ")}`,
      method: "GET",
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      json: true,
    };

    const searching = new Discord.MessageEmbed()
      .setColor(colors.error)
      .setTitle("Senpai~ Give me a moment " + emojis.Giggle)
      .setDescription(
        emojis.Search + " **Searching for ** ```" + args.join(" ") + "```"
      )
      .setTimestamp()
      .setFooter("Requested by " + message.member.user.tag);

    message.reply({ embeds: [searching] }).then((msg) => {
      get(option).then((body) => {
        if (body.data[0].attributes.nsfw && !message.channel.nsfw) return message.reply({ embeds: [nsfwerr] });
        try {
          let embed = new Discord.MessageEmbed()
            .setTitle(body.data[0].attributes.titles.en)
            .setColor(colors.success)
            .setDescription("```" + body.data[0].attributes.synopsis + "```")
            .setThumbnail(body.data[0].attributes.posterImage.large)
            .setImage()
            .addField(
              "Ratings",
              "```" + body.data[0].attributes.averageRating + "```",
              true
            )
            .addField(
              "Total Episodes",
              "```" + body.data[0].attributes.episodeCount + "```",
              true
            )
            .setTimestamp()
            .setFooter("Requested by " + message.member.user.tag);
          //.setImage(body.data[0].attributes.coverImage.large)
          //try it

          message.reply({ embeds: [embed] });
          msg.delete();
        } catch (err) {
          msg.delete();

          const errmsg = new Discord.MessageEmbed()
            .setColor(colors.error)
            .setTitle(configs.missing_title_fun + emojis.Hmm)
            .setDescription(
              emojis.Sip +
                "Did you type it in correctly? \n I wasn't able to find the anime you were looking for."
            )
            .setTimestamp()
            .setFooter("Requested by " + message.member.user.tag);

          return message.reply({ embeds: [errmsg] });
        }
      });
    });
  },
};
