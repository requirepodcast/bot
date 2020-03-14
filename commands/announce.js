const Discord = require("discord.js");

exports.run = (client, message, args) => {
	let staff = message.guild.roles.find(r => r.name === "require('prowadzący')");
	if (!message.member.roles.has(staff.id))
		return message.reply("Insufficient permissions.");

	let announcements = message.guild.channels.find(
		c => c.name === "ogłoszenia" && c.parent.name === "require('info');"
	);

	let argument = args.join(" ");
	let [title, content] = argument.split(" | ");

	if (!title) return message.reply("Please enter the announcement title.");
	if (!content) return message.reply("Please enter the announcement content.");

	let embed = new Discord.RichEmbed()
		.setTitle(title.toString())
		.setDescription(content.toString())
		.setColor(client.config.colors.primary)
		.setFooter(`~ ${message.member.nickname}`)
		.setTimestamp();

	announcements.send("@everyone").then(m => m.delete(1000));
	announcements.send(embed);
};

exports.help = {
	name: "announce",
	description: "Send a public announcement in the #ogłoszenia channel.",
	usage: "announce <title> | <content>",
	staff: true
};
