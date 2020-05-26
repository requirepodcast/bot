const fs = require("fs");
let reactionRoles = JSON.parse(fs.readFileSync("./reactionRoles.json", "utf8"));

module.exports = (client, event) => {
	if (event.t === "MESSAGE_REACTION_ADD") {
		let channel = client.channels.get(event.d.channel_id);
		if (channel.id !== client.config.roleChannel) return;
		if (!reactionRoles[event.d.emoji.name]) return;

		channel.fetchMessage(event.d.message_id).then(async msg => {
			let member = msg.guild.members.get(event.d.user_id);
			if (member.user.bot) return;

			member.addRole(reactionRoles[event.d.emoji.name]);
		});
	} else if (event.t === "MESSAGE_REACTION_REMOVE") {
		let channel = client.channels.get(event.d.channel_id);
		if (channel.id !== client.config.roleChannel) return;
		if (!reactionRoles[event.d.emoji.name]) return;

		channel.fetchMessage(event.d.message_id).then(async msg => {
			let member = msg.guild.members.get(event.d.user_id);
			if (member.user.bot) return;

			member.removeRole(reactionRoles[event.d.emoji.name]);
		});
	}
};
