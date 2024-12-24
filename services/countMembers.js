async function getMembersCount(channel) {
    if (channel === null) return 0;
    const fetchedChannel = await channel.fetch(true);
    return fetchedChannel.members.size;
}

module.exports = {
    getMembersCount
}