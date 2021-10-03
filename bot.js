require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const http = require("http");

const client = new Discord.Client();
const config = require("./config.js");
client.config = config;
client.playing = false;
const app = express();
const port = process.env.PORT || 3000;
const webhooks = require("./handlers/webhooks");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => res.status(200).send("Hello World!"));

app.use(
	"/",
	(req, res, next) => {
		req.client = client;
		next();
	},
	webhooks
);

app.listen(port, () => console.log(`Server listening on port ${port}`));

fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.map((file) => {
		let event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));
	});
});

client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);
	console.log("[Commands] Loading...");
	files.map((file) => {
		if (!file.endsWith(".js")) return;
		let props = require(`./commands/${file}`);
		console.log(`[Commands] Loaded ${file}`);
		client.commands.set(props.help.name, props);
	});
	console.log(`[Commands] Loaded ${files.length} commands!`);
});

client.login(client.config.token);
