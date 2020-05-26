const Discord = require("discord.js");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const http = require("http");

require("dotenv").config();

const client = new Discord.Client();
const config = require("./config.js");
client.config = config;
client.playing = false;
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => res.status(200).send("Hello World!"));

setInterval(() => {
	http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 260000);

app.post("/announcement/webhook", (req, res) => {
	if (req.headers.authorization !== process.env.WEBHOOK_AUTHORIZATION)
		return res.status(401).json({ message: "Unauthorized" });

	let announcements = JSON.parse(
		fs.readFileSync("./announcements.json", "utf8")
	);
	if (announcements.sent.includes(req.body.sys.id))
		return res.status(302).json({ message: "Announcement already posted" });

	let guild = client.guilds.find(g => g.id === client.config.guild);
	let channel = guild.channels.find(
		c => c.id === client.config.announcementChannel
	);
	let role = guild.roles.find(r => r.id === client.config.episodePing);

	let emoji =
		client.config.emojis[
			Math.floor(Math.random() * client.config.emojis.length)
		];

	let embed = new Discord.RichEmbed()
		.setAuthor(
			"Require Podcast",
			"https://i.imgur.com/ZHV3sG1.png",
			"https://require.podcast.gq/"
		)
		.setTimestamp(req.body.sys.createdAt)
		.setTitle(req.body.fields.title["pl-PL"])
		.setDescription(req.body.fields.shortDescription["pl-PL"])
		.setColor(client.config.colors.primary)
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

app.post("/render/webhook", (req, res) => {
	if (req.headers.authorization !== process.env.WEBHOOK_AUTHORIZATION)
		return res.status(401).json({ message: "Unauthorized" });

	let guild = client.guilds.find(g => g.id === client.config.guild);
	let channel = guild.channels.find(c => c.id === "712586635417747479");
	let role = guild.roles.find(r => r.id === "675309294748565515");

	let embed = new Discord.RichEmbed()
		.setAuthor(
			"Require Podcast Render Server",
			"https://i.imgur.com/ZHV3sG1.png",
			"http://requirepodcast-render-server.herokuapp.com/"
		)
		.setTimestamp()
		.setTitle(req.body.title)
		.setDescription(req.body.description)
		.setColor(client.config.colors.primary);

	if (req.body.user && !req.body.userAvatar)
		embed.setFooter(`Action performed by ${req.body.user}`);
	if (req.body.user && req.body.userAvatar)
		embed.setFooter(
			`Action performed by ${req.body.user}`,
			req.body.userAvatar
		);

	channel.send(`${role}`).then(channel.send(embed));
	if (req.body.attachment)
		channel.send(new Discord.Attachment(req.body.attachment));
	if (req.body.attachment2)
		channel.send(new Discord.Attachment(req.body.attachment2));
	return res
		.status(201)
		.json({ message: "Succesfully sent Discord announcement." });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));

fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.map(file => {
		let event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));
	});
});

client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);
	console.log("[Commands] Loading...");
	files.map(file => {
		if (!file.endsWith(".js")) return;
		let props = require(`./commands/${file}`);
		console.log(`[Commands] Loaded ${file}`);
		client.commands.set(props.help.name, props);
	});
	console.log(`[Commands] Loaded ${files.length} commands!`);
});

client.login(client.config.token);
