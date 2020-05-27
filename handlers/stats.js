const Parser = require("rss-parser");
const parser = new Parser();

const update = client => {
	let guild = client.guilds.cache.find(g => g.id === client.config.guild);
	let channel1 = guild.channels.cache.find(c => c.id === "712226628813717515");
	let channel2 = guild.channels.cache.find(c => c.id === "712230478949646467");
	let channel3 = guild.channels.cache.find(c => c.id === "712233442984591431");

	parser.parseURL(client.config.rssURL).then(({ items }) => {
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

module.exports = { update };
