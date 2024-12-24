const { getChannelsByGuild } = require('@modules/database');
const { getMembersCount } = require('@services/countMembers');
const isStateChangeLegitimate = require('@utils/isStateChangeLegitimate');

module.exports = async (client, oldState, newState) => {
    const { member, channel } = newState;
    const newMembersCount = await getMembersCount(newState.channel);
    const timeOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    if (!isStateChangeLegitimate(oldState, newState)) {
        console.log(`${new Date()} - State change is not legitimate.`);
        return;
    }
    if (newMembersCount > 1) {
        console.log(
            `${new Date()} - No need to announce : ${newMembersCount} members in the channel.`
        );
        return;
    }

    if (channel) {
        const result = await getChannelsByGuild(channel.guild.id);
        const announcementChannelId = result["announcementId"];
        const vocalChannelId = result["vocalChannelId"];

        if (channel.id === vocalChannelId) {
            const userName = member.user.username;
            const textChannel = client.channels.cache.get(announcementChannelId);
            console.log(`${new Date().toLocaleDateString(undefined, timeOptions)} - ${userName} has joined the voice channel`);
            textChannel.send(`🪶 ${userName} has joined the voice channel.`);
        }
    }
};