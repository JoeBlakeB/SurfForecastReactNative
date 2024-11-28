/**
 * @fileoverview Utility functions that don't fit well in a single file.
 */

/**
 * Convert a wave height number (min) to the number to colour the text.
 * 
 * @param {int} waveHeight in feet (min height)
 * @returns hex colour code
 */
export function waveHeightToColour(waveHeight) {
    if (waveHeight === undefined) {
        return "#000000";
    } else if (waveHeight >= 4) {
        return "#55995a";
    } else if (waveHeight >= 2) {
        return "#e2bd4d";
    } else if (waveHeight >= 1) {
        return "#db8734";
    } else {
        return "#e84b43";
    }
}