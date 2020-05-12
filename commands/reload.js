const Discord = require("discord.js");

exports.run = async (client, message, args) => {
	if (message.author.id !== "214651290234388480")
		return message.reply("This is a developer only command.");

	if (!args[0] || args.size < 1)
		return message.reply(
			"Please provide the name of a command you wish to reload."
		);

	let commandName = args[0];
	if (!client.commands.has(commandName)) {
		return message.reply("That command does not exist.");
	}

	delete require.cache[require.resolve(`./${commandName}.js`)];

	try {
		let props = require(`./${commandName}.js`);
		client.commands.delete(commandName);
		client.commands.set(commandName, props);
	} catch (e) {
		let embed = new Discord.RichEmbed()
			.setAuthor("An error occured!", "https://i.imgur.com/FCZNSQa.png")
			.setDescription(e)
			.setColor(client.config.colors.secondary)
			.setTimestamp();

		return message.channel.send(embed);
	}

	let embed = new Discord.RichEmbed()
		.setAuthor(
			"Reload Successful!",
			"https://mxpez29397.i.lithium.com/html/images/emoticons/2705.png"
		)
		.setDescription(`Reloaded **${commandName}.js**!`)
		.setColor(client.config.colors.primary)
		.setTimestamp();

	message.channel.send(embed);

	console.log(`[Commands] Manual reload of ${commandName}.js completed!`);
};

exports.help = {
	name: "reload",
	description: "Reload a command.",
	usage: "reload <command>",
	staff: true,
};
