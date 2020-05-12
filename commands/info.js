const Discord = require("discord.js");

exports.run = (client, message, args) => {
	let staff = message.guild.roles.find(r => r.name === "require('prowadzący')");
	if (!message.member.roles.has(staff.id))
		return message.reply("Brak uprawnień.");

	return message.channel.send(
		new Discord.RichEmbed()
			.setAuthor("Require Podcast", `https://i.imgur.com/ZHV3sG1.png`)
			.setDescription(
				"Przemyślenia dwójki programistów - Adama i Artura - na temat nowości i wydarzeń w świecie frontendu, backendu i nie tylko."
			)
			.addField(
				"Ważne linki",
				"⮞ [:earth_africa: Strona](https://require.podcast.gq/)\n⮞ [:cloud: SoundCloud](https://soundcloud.com/requirepodcast) \n⮞ [:arrow_forward: YouTube](https://www.youtube.com/channel/UCec_mTVjUKQAsSilMJ3J1TQ) \n⮞ [:satellite: Spotify](https://open.spotify.com/show/55IXMbPmncm67FA5ZAydtL) \n⮞ [:green_apple: Apple Podcasts](https://podcasts.apple.com/podcast/id1502694357) \n⮞ [:books: Google Podcasts](https://www.google.com/podcasts?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy8xMzlkZjg5Yy9wb2RjYXN0L3Jzcw==) \n⮞ [:anchor: Anchor](https://anchor.fm/require) \n⮞ [:speech_balloon: Discord](https://require.podcast.gq/discord) \n⮞ [:bird: Twitter](https://twitter.com/requirepodcast) \n⮞ [:camera: Instagram](https://www.instagram.com/requirepodcast/) \n⮞ [:computer: GitHub](https://github.com/requirepodcast) \n⮞ [:newspaper: Reddit](https://www.reddit.com/r/requirepodcast) \n⮞ :mailbox_with_no_mail: require@podcast.gq"
			)
			.setFooter(
				"Copyright © The Require Podcast • Bot stworzony przez Artura Dudka"
			)
			.setColor(client.config.colors.primary)
	);
};

exports.help = {
	name: "info",
	description: "Wysyła embed do kanału info.",
	usage: "info",
	staff: true,
};
