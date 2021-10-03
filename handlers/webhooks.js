const express = require("express");
const Discord = require("discord.js");
const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();
const router = express.Router();

router.post("/announcement/webhook", (req, res) => {
  parser.parseURL(req.client.config.rssURL).then(({ items }) => {
    let item = items[0];

    let announcements = JSON.parse(fs.readFileSync("./announcements.json", "utf8"));
    if (announcements.sent.includes(item.title))
      return res.status(200).json({ message: "Announcement already posted" });

    let guild = req.client.guilds.cache.find(g => g.id === req.client.config.guild);
    let channel = guild.channels.cache.find(c => c.id === req.client.config.announcementChannel);
    let role = guild.roles.cache.find(r => r.id === req.client.config.episodePing);

    let emoji =
      req.client.config.emojis[Math.floor(Math.random() * req.client.config.emojis.length)];

    let embed = new Discord.MessageEmbed()
      .setAuthor(
        "Require Podcast",
        "https://i.imgur.com/ZHV3sG1.png",
        "https://require.podcast.gq/",
      )
      .setTimestamp(item.pubDate)
      .setTitle(item.title)
      .setDescription(item.contentSnippet)
      .setColor(req.client.config.colors.primary)
      .setURL(item.link);

    announcements.sent.push(item.title);
    fs.writeFileSync("./announcements.json", JSON.stringify(announcements), () =>
      console.log("done"),
    );

    channel.send(`${role}, Nowy Odcinek! ${emoji}`, embed);
    return res.status(201).json({ message: "Succesfully sent Discord announcement." });
  });
});

router.post("/render/webhook", (req, res) => {
  if (req.headers.authorization !== process.env.WEBHOOK_AUTHORIZATION)
    return res.status(401).json({ message: "Unauthorized" });

  let guild = req.client.guilds.cache.find(g => g.id === req.client.config.guild);
  let channel = guild.channels.cache.find(c => c.id === "712586635417747479");
  let role = guild.roles.cache.find(r => r.id === "675309294748565515");

  let embed = new Discord.MessageEmbed()
    .setAuthor(
      "Require Podcast Render Server",
      "https://i.imgur.com/ZHV3sG1.png",
      "http://requirepodcast-render-server.herokuapp.com/",
    )
    .setTimestamp()
    .setTitle(req.body.title)
    .setDescription(req.body.description)
    .setColor(req.client.config.colors.primary);

  if (req.body.user && !req.body.userAvatar)
    embed.setFooter(`Action performed by ${req.body.user}`);
  if (req.body.user && req.body.userAvatar)
    embed.setFooter(`Action performed by ${req.body.user}`, req.body.userAvatar);

  channel.send(`${role}`).then(channel.send(embed));
  if (req.body.attachment) channel.send(new Discord.MessageAttachment(req.body.attachment));
  if (req.body.attachment2) channel.send(new Discord.MessageAttachment(req.body.attachment2));
  return res.status(201).json({ message: "Succesfully sent Discord announcement." });
});

module.exports = router;
