const Discord = require("discord.js");

const sendMail = (client, message) => {
	let channel = client.channels.get("688350581601206289");

	let embed = new Discord.MessageEmbed()
		.setAuthor(
			`${message.author.tag} • ${message.author.id}`,
			message.author.avatarURL
		)
		.setFooter(
			`Aby odpowiedzieć użyj -reply ${message.author.id} ${message.id}`
		)
		.addField(`ID Wiadomości: \`${message.id}\``, `${message.content}`)
		.setTimestamp(message.createdTimestamp)
		.setColor(client.config.colors.secondary);

	let confirmation = new Discord.MessageEmbed()
		.setTimestamp()
		.setColor(client.config.colors.secondary)
		.setDescription(
			"Pomyślnie wysłano wiadomość do moderatorów.\nOdpiszemy wkrótce, prosimy o cierpliwość."
		);

	channel.send(embed);
	message.channel.send(confirmation);
};

module.exports = { sendMail };
