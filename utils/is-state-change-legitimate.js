/**
 * List of voice state properties that should not trigger announcements when changed
 * These are typically user control actions like mute/unmute, turning video on/off, etc.
 * @type {string[]}
 */
const IGNORED_STATE_PROPERTIES = [
  "deaf",
  "mute",
  "self_deaf",
  "self_mute",
  "self_stream",
  "self_video",
  "streaming",
  "video",
];

/**
 * Determines if a voice state change should trigger an announcement
 * Returns true if the change is a channel join/leave, rather than just settings changes
 * 
 * @param {VoiceState} oldState - The previous voice state
 * @param {VoiceState} newState - The new voice state
 * @returns {boolean} True if the state change should be processed, false if it should be ignored
 */
function isStateChangeLegitimate(oldState, newState) {
  // Check if any of the ignored properties changed
  for (const prop of IGNORED_STATE_PROPERTIES) {
    if (oldState[prop] !== newState[prop]) {
      return false;
    }
  }
  
  return true;
}

module.exports = isStateChangeLegitimate;