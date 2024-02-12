
const stateProperties = [
    "deaf",
    "mute",
    "self_deaf",
    "self_mute",
    "self_stream",
    "self_video",
    "streaming",
    "video",
];

module.exports = function isStateChangeLegitimate(oldState, newState) {
    for (const prop of stateProperties) {
        if (oldState[prop] !== newState[prop]) {
            return false;
        }
    }
    return true;
}