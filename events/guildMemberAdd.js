const Discord = require("discord.js");

module.exports = (client, member) => {
	let embed = new Discord.RichEmbed()
		.setColor(client.config.colors.primary)
		.setAuthor("Require Podcast", "https://i.imgur.com/ZHV3sG1.png")
		.setDescription(
			`Witamy w oficjalnym serwerze Require Podcast!\n\nNie zapomnij zapoznać się z regulaminem, życzymy miłego słchania 📻`
		)
		.setTimestamp();

	member.user.send(embed);
};
