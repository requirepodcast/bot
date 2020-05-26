const Discord = require("discord.js");
const Parser = require("rss-parser");

const parser = new Parser();

exports.run = (client, message, args) => {
	let voiceChannel = message.member.voiceChannel;
	if (!voiceChannel || voiceChannel.id !== client.config.podcastVoice)
		return message.reply("Aby słuchać podcastu dołącz do kanału `Podcast 📻`.");

	let searchTerm = args.join(" ");

	if (client.playing) return;
	client.playing = true;

	if (searchTerm) message.channel.send(`🔍 Szukam \`${args.join(" ")}\`...`);
	else message.channel.send("Nie podano odcinka, odtwarzam najnowszy...");

	parser.parseURL(client.config.rssURL).then(({ items }) => {
		let item;

		if (!isNaN(args[0])) item = items.reverse()[parseInt(args[0])];
		else
			item = items.filter(i => {
				return (
					i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					i.content.toLowerCase().includes(searchTerm.toLowerCase())
				);
			})[0];

		if (item === undefined) {
			client.playing = false;
			return message.reply("Nie znalazłem takiego odcinka.");
		}

		let episodeEmbed = new Discord.RichEmbed()
			.setAuthor(
				"Require Podcast",
				`https://i.imgur.com/ZHV3sG1.png`,
				"https://require.podcast.gq/"
			)
			.setDescription(`▶️ Odtwarzam [**${item.title}**](${item.link})...`)
			.addField("Opis", item.contentSnippet)
			.setThumbnail(item.itunes.image)
			.setColor(client.config.colors.primary)
			.setFooter(
				`Długość: ${new Date(parseInt(item.itunes.duration) * 1000)
					.toISOString()
					.substr(11, 8)}`
			)
			.setTimestamp(new Date(item.isoDate));

		message.channel.send(episodeEmbed);

		voiceChannel
			.join()
			.then(connection => {
				const dispatcher = connection.playFile(item.enclosure.url);

				dispatcher.on("speaking", speaking => {
					if (speaking !== 1) return;
					voiceChannel.leave();
					client.playing = false;
					message.channel.send("Odtwarzanie zakończone, opuszczam kanał...");
				});
			})
			.catch(err => {
				console.log(err);
				client.playing = false;
			});
	});
};

exports.help = {
	name: "play",
	description: "Posłuchaj naszego podkastu prosto z discorda!",
	usage: "play <numer / keyword>",
};
