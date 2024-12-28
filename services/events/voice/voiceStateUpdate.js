require('module-alias/register');

const { getChannelsByGuild } = require('@modules/database');
const { getMembersCount } = require('@services/countMembers');
const isStateChangeLegitimate = require('@utils/isStateChangeLegitimate');
const logger = require('@utils/logger');

module.exports = async (client, oldState, newState) => {
    const { member, channel } = newState;
    const newMembersCount = await getMembersCount(newState.channel);

    if (!isStateChangeLegitimate(oldState, newState)) {
        logger(`State change is not legitimate.`);
        return;
    }
    if (newMembersCount > 1) {
        logger(`No need to announce : ${newMembersCount} members in the channel.`);
        return;
    }

    if (channel) {
        const result = await getChannelsByGuild(channel.guild.id);
        const announcementChannelId = result["announcementId"];
        const vocalChannelId = result["vocalChannelId"];

        if (channel.id === vocalChannelId) {
            const userName = member.user.username;
            const textChannel = client.channels.cache.get(announcementChannelId);
            logger(`${userName} has joined the voice channel`);
            textChannel.send(`🪶 ${userName} has joined the voice channel.`);
        }
    }
};