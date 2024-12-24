
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
        if (oldState[prop] !== null && oldState[prop] !== newState[prop]) {
            console.log("prop: " + prop + " : " + oldState[prop] + " different than " + newState[prop]);
            return false;
        }
    }
    return true;
}