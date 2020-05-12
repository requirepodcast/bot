const Discord = require("discord.js");

exports.run = (client, message, args) => {
	let staff = message.guild.roles.find(
		(r) => r.name === "require('prowadzący')"
	);
	if (!message.member.roles.has(staff.id))
		return message.reply("Brak uprawnień.");

	let announcements = message.guild.channels.find(
		(c) => c.name === "ogłoszenia" && c.parent.name === "require('info');"
	);

	let argument = args.join(" ");
	let [title, content, ping] = argument.split(" | ");

	if (!title) return message.reply("Proszę wpisać tytuł ogłoszenia.");
	if (!content) return message.reply("Proszę wpisać treść ogłoszenia.");

	let embed = new Discord.RichEmbed()
		.setTitle(title.toString())
		.setDescription(content.toString())
		.setColor(client.config.colors.primary)
		.setFooter(`~ ${message.member.nickname || message.author.username}`)
		.setTimestamp();

	if (ping && ping === "true")
		announcements.send("@everyone").then((m) => m.delete(1000));
	announcements.send(embed);
	message.reply(`Wysłano ogłoszenie ${announcements.toString()}`);
};

exports.help = {
	name: "announce",
	description: "Wysyła ogłoszenie w kanale #ogłoszenia.",
	usage: "announce <title> | <content> | [ping ? true]",
	staff: true,
};
