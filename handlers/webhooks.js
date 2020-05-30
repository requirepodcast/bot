const express = require("express");
const Discord = require("discord.js");
const fs = require("fs");

const router = express.Router();

router.post("/announcement/webhook", (req, res) => {
	if (req.headers.authorization !== process.env.WEBHOOK_AUTHORIZATION)
		return res.status(401).json({ message: "Unauthorized" });

	let announcements = JSON.parse(
		fs.readFileSync("./announcements.json", "utf8")
	);
	if (announcements.sent.includes(req.body.sys.id))
		return res.status(302).json({ message: "Announcement already posted" });

	let guild = req.client.guilds.cache.find(
		g => g.id === req.client.config.guild
	);
	let channel = guild.channels.cache.find(
		c => c.id === req.client.config.announcementChannel
	);
	let role = guild.roles.cache.find(
		r => r.id === req.client.config.episodePing
	);

	let emoji =
		req.client.config.emojis[
			Math.floor(Math.random() * req.client.config.emojis.length)
		];

	let embed = new Discord.MessageEmbed()
		.setAuthor(
			"Require Podcast",
			"https://i.imgur.com/ZHV3sG1.png",
			"https://require.podcast.gq/"
		)
		.setTimestamp(req.body.sys.createdAt)
		.setTitle(req.body.fields.title["pl-PL"])
		.setDescription(req.body.fields.shortDescription["pl-PL"])
		.setColor(req.client.config.colors.primary)
		.setURL(req.body.fields.spotifyUrl["pl-PL"]);

	announcements.sent.push(req.body.sys.id);
	fs.writeFileSync("./announcements.json", JSON.stringify(announcements), () =>
		console.log("done")
	);

	channel.send(`${role}, Nowy Odcinek! ${emoji}`).then(channel.send(embed));
	return res
		.status(201)
		.json({ message: "Succesfully sent Discord announcement." });
});

router.post("/render/webhook", (req, res) => {
	if (req.headers.authorization !== process.env.WEBHOOK_AUTHORIZATION)
		return res.status(401).json({ message: "Unauthorized" });

	let guild = req.client.guilds.cache.find(
		g => g.id === req.client.config.guild
	);
	let channel = guild.channels.cache.find(c => c.id === "712586635417747479");
	let role = guild.roles.cache.find(r => r.id === "675309294748565515");

	let embed = new Discord.MessageEmbed()
		.setAuthor(
			"Require Podcast Render Server",
			"https://i.imgur.com/ZHV3sG1.png",
			"http://requirepodcast-render-server.herokuapp.com/"
		)
		.setTimestamp()
		.setTitle(req.body.title)
		.setDescription(req.body.description)
		.setColor(req.client.config.colors.primary);

	if (req.body.user && !req.body.userAvatar)
		embed.setFooter(`Action performed by ${req.body.user}`);
	if (req.body.user && req.body.userAvatar)
		embed.setFooter(
			`Action performed by ${req.body.user}`,
			req.body.userAvatar
		);

	channel.send(`${role}`).then(channel.send(embed));
	if (req.body.attachment)
		channel.send(new Discord.MessageAttachment(req.body.attachment));
	if (req.body.attachment2)
		channel.send(new Discord.MessageAttachment(req.body.attachment2));
	return res
		.status(201)
		.json({ message: "Succesfully sent Discord announcement." });
});

module.exports = router;
