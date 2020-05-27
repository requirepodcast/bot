const Discord = require("discord.js");

exports.run = (client, message, args) => {
	let staff = message.guild.roles.cache.find(r => r.name === "require('mod')");
	if (!message.member.roles.cache.has(staff.id))
		return message.reply("Brak uprawnień.");

	let replyUserID = args.shift();
	if (!client.users.get(replyUserID))
		return message.reply("Nie znaleziono użytkownika.");
	let replyUser = message.guild.members.cache.get(replyUserID).user;
	replyUser.createDM().then(replyUserChannel => {
		let replyMessageID = args.shift();
		//console.log(replyUserChannel.messages.map(m => m.id));
		if (!replyUserChannel.messages.fetch(replyMessageID))
			return message.reply("Nie znaleziono wiadomości.");
		let replyMessage = replyUserChannel.messages.fetch(replyMessageID);

		let text = args.join(" ");

		let embed = new Discord.MessageEmbed()
			.setAuthor(message.author.tag, message.author.avatarURL)
			.setDescription(text)
			.addField(
				`${replyUser.username} napisał(a):`,
				`\`${replyMessage.content}\``
			)
			.setTimestamp(message.createdTimestamp)
			.setColor(client.config.colors.primary);

		let confirmation = new Discord.MessageEmbed()
			.setTimestamp()
			.setColor(client.config.colors.primary)
			.setDescription("Pomyślnie odpowiedziano na wiadomość.");

		replyUserChannel.send(embed);
		message.channel.send(confirmation);
	});
};

exports.help = {
	name: "reply",
	description: "Wysyła odpowiedź na ModMaila.",
	usage: "reply <user id> <message id> <text>",
	staff: true,
};
