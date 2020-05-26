const Discord = require("discord.js");
const Parser = require("rss-parser");

const parser = new Parser();

exports.run = (client, message, args) => {
	let searchTerm = args.join(" ");

	//if (client.playing) return;
	client.playing = true;

	message.channel.send(`🔍 Szukam \`${args.join(" ")}\``);

	parser
		.parseURL("https://anchor.fm/s/139df89c/podcast/rss")
		.then(({ items }) => {
			let item;
			if (!isNaN(args[0])) item = items.reverse()[parseInt(args[0])];
			else
				item = items.filter(i => {
					return (
						i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
						i.content.toLowerCase().includes(searchTerm.toLowerCase())
					);
				})[0];
			if (item === undefined)
				return message.reply("Nie znalazłem takiego odcinka.");

			message.channel.send(`▶️ Odtwarzanie **${item.title}**`);
			let voiceChannel = message.member.voiceChannel;
			voiceChannel
				.join()
				.then(connection => {
					const dispatcher = connection.playFile(item.enclosure.url);

					dispatcher.on("speaking", speaking => {
						if (speaking !== 1) return;
						voiceChannel.leave();
						client.playing = false;
					});
				})
				.catch(err => console.log(err));
		});
};

exports.help = {
	name: "play",
	description: "Posłuchaj naszego podkastu prosto z discorda!",
	usage: "play <number>",
};
