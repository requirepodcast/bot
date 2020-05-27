const stats = require("../handlers/stats");

module.exports = client => {
	console.log(`\n             require('bot');\n`);
	console.log(
		`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
	);
	console.log(`Logged in as ${client.user.tag} [ID: ${client.user.id}]\n`);

	client.user.setStatus("available");
	client.user.setActivity("Require Podcast", { type: "LISTENING" });

	let i = 0;
	setInterval(() => {
		if (i > statuses.length - 1) i = 0;
		client.user.setActivity(statuses[i], { type: "LISTENING" });
		i++;
	}, 60000);

	stats.update(client);
};

let statuses = ["Require Podcast", "DM for ModMail"];
