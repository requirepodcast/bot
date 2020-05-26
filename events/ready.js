const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();

module.exports = client => {
	console.log(`\n             require('bot');\n`);
	console.log(
		`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`
	);
	console.log(`Logged in as ${client.user.tag} [ID: ${client.user.id}]\n`);

	client.user.setStatus("available");
	client.user.setPresence({
		game: {
			name: "Require Podcast",
			type: "LISTENING",
		},
	});

	let i = 0;
	setInterval(() => {
		if (i > statuses.length - 1) i = 0;
		client.user.setPresence({
			game: {
				name: statuses[i],
				type: "LISTENING",
			},
		});
		i++;
	}, 60000);

	let guild = client.guilds.find(g => g.id === client.config.guild);
	let channel1 = guild.channels.find(c => c.id === "712226628813717515");
	let channel2 = guild.channels.find(c => c.id === "712230478949646467");
	let channel3 = guild.channels.find(c => c.id === "712233442984591431");

	parser
		.parseURL("https://anchor.fm/s/139df89c/podcast/rss")
		.then(({ items }) => {
			channel1.setName(`Odcinki: ${items.length}`);
			let duration = 0;
			for (let episode of items) {
				duration += parseInt(episode.itunes.duration);
			}
			let time = new Date(duration * 1000).toISOString().substr(11, 8);
			channel2.setName(`Łączna długość: ${time}`);
			channel3.setName(
				`Srednia długość: ${Math.ceil(duration / items.length / 60) + " min."}`
			);
		});
};

let statuses = ["Require Podcast", "DM for ModMail"];
