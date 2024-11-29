/**
 * @fileoverview The row of days of the forecast wave height, showing min-max and colours for morning,noon,night
 */

import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { waveHeightToColour } from "./Utils";

/**
 * A row of days forecasts.
 * 
 * @param {Array} surf the forecast wave heights
 * @returns {React.ReactElement}
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
                        {surfData ? (
                            <LinearGradient
                                colors={[
                                    waveHeightToColour(surfData.morning?.min || 0),
                                    waveHeightToColour(surfData.noon?.min || 0),
                                    waveHeightToColour(surfData.noon?.min || 0),
                                    waveHeightToColour(surfData.night?.min || 0),
                                ]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                locations={[0.27,0.38,0.62,0.73]}
                                style={styles.colorBar}
                            />
                        ) : (
                            <View style={[styles.colorBar, { backgroundColor: "#d3d3d3" }]} />
                        )}
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
        height: 6,
        flex: 1,
        marginHorizontal: 2,
        borderRadius: 2,
    },
});

export default WaveHeightForecastsRow;
