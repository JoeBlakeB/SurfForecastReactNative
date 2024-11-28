/**
 * @fileoverview The row of days of the forecast wave height, showing min-max and colours for morning,noon,night
 */

import { View, Text, StyleSheet } from "react-native";
import { waveHeightToColour } from "./Utils";

/**
 * @param {Array} surf the forecast wave heights
 */
function WaveHeightForecastsRow({ surf }) {
    return (
        <View style={styles.forecastContent}>
            {(surf ? surf : Array(5).fill(null)).map((surfData, index) => (
                <View key={index} style={styles.forecastItem}>
                    <Text style={styles.forecastText}>
                            {(surfData ?
                                `${surfData.all.min}-${surfData.all.max}${surfData.all.maxPlus ? "+" : ""}`
                            : "")}
                        </Text>
                    <View style={styles.colorBarContainer}>
                        {["morning", "noon", "night"].map((time, idx) => (
                            <View
                                key={idx}
                                style={[
                                    styles.colorBar,
                                    { backgroundColor: (surfData ? waveHeightToColour(surfData[time]?.min || 0) : "#d3d3d3") },
                                ]}
                            />
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    forecastContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    forecastItem: {
        flex: 1,
        alignItems: "center",
        marginHorizontal: 4,
    },
    forecastText: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
    },
    colorBarContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    colorBar: {
        height: 5,
        flex: 1,
        marginHorizontal: 2,
        borderRadius: 2,
    },
});

export default WaveHeightForecastsRow;
