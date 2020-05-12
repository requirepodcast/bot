const Discord = require("discord.js");

exports.run = async (client, message, args) => {
	let staff = message.guild.roles.find(
		(r) => r.name === "require('prowadzący')"
	);

	if (!args[0]) {
		let embed = new Discord.RichEmbed()
			.setAuthor(message.author.tag, message.author.avatarURL)
			.setColor(client.config.colors.primary)
			.setDescription(`Wysłałem do ciebię listę komend! Sprawdź DM.`);

		let help = new Discord.RichEmbed()
			.setTitle("Komendy")
			.setColor(client.config.colors.primary);

		if (!message.member.roles.has(staff.id))
			help.setDescription(
				"Użyj `-help [command]` aby uzyskać informacje o danej komendzie.\n\n" +
					client.commands
						.filter((cmd) => !cmd.help.staff)
						.map((cmd) => `\`${cmd.help.name}\` - ${cmd.help.description}`)
						.join("\n")
			);
		else
			help.setDescription(
				"Użyj `-help [command]` aby uzyskać informacje o danej komendzie.\n\n" +
					client.commands
						.map((cmd) => `\`${cmd.help.name}\` - ${cmd.help.description}`)
						.join("\n")
			);

		message.author.send(help).catch(() => {
			let error = new Discord.RichEmbed()
				.setAuthor("Wystąpił błąd!", "https://i.imgur.com/FCZNSQa.png")
				.setDescription("Nie mogłem wysłać do ciebie wiadomości!")
				.setColor(client.config.colors.secondary)
				.setTimestamp();

			message.channel.send(error);
			return message.delete();
		});

		message.channel.send(embed).then((m) => m.delete(10000));
		message.delete();
	} else if (args[0]) {
		let command = client.commands.get(args[0]);
		if (!command) return message.reply("Proszę wpisać poprawną komendę!");

		let props = require(`./${args[0]}.js`);

		if (!message.member.roles.has(staff.id) && props.help.staff)
			return message.reply("Proszę wpisać poprawną komendę!");

		let embed = new Discord.RichEmbed()
			.setTitle(`Komenda`)
			.setColor(client.config.colors.primary)
			.setDescription(
				`**Nazwa:** ${props.help.name}\n**Opis:** ${props.help.description}\n**Sposób użycia:** ${client.config.prefix}${props.help.usage}`
			);

		message.channel.send(embed);
		message.delete();
	}
};

exports.help = {
	name: "help",
	description: "Wysyła listę komend lub dane odnośnie wybranej komendy.",
	usage: "help [command]",
};
