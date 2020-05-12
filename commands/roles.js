const Discord = require("discord.js");

exports.run = (client, message, args) => {
	let staff = message.guild.roles.find(
		(r) => r.name === "require('prowadzący')"
	);
	if (!message.member.roles.has(staff.id))
		return message.reply("Brak uprawnień.");

	message.channel
		.send(
			new Discord.RichEmbed()
				.setTitle("Wybieranie ról")
				.setDescription(
					"🔔 - Powiadomienia o nowych odcinkach. [<@&704360495972352090>]"
				)
				.setFooter(
					"Zareaguj odpowiednią emotką aby otrzymać wybraną rolę.\nUsuń reakcję aby się jej pozbyć."
				)
				.setColor(client.config.colors.primary)
		)
		.then((m) => m.react("🔔"));
};

exports.help = {
	name: "roles",
	description: "Wysyła embed do wybierania ról.",
	usage: "roles",
	staff: true,
};
