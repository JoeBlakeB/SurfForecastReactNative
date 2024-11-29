/**
 * @fileoverview A single spot card to be used within a list on the spot guide screen.
 */

import { Text, TouchableOpacity, Image, StyleSheet, View } from "react-native";
import StarRating from "./StarRating";
import { waveHeightToColour } from "./Utils";
import WaveHeightForecastsRow from "./WaveHeightForecastsRow";

/**
 * A card to show the current rating of a spot, and forecast wave heights over the next few days.
 * 
 * @param {Spot} spot the spot to show on the card
 * @returns {React.ReactElement}
 */
function SpotForecastCard({ spot }) {
    return (
        <TouchableOpacity
            style={styles.beachCard}
            delayPressIn={50}
            activeOpacity={0.9}
        >
            <View style={styles.topContent}>
                <View style={styles.leftContent}>
                    {spot.name ? (
                        <Text style={styles.title}>{spot.name}</Text>
                    ) : (
                        <View style={styles.placeholderTitle} />
                    )}

                    {spot.waveHeight?.humanRelation ? (
                        <Text
                            style={[
                                styles.waveHeight,
                                { color: waveHeightToColour(spot.waveHeight?.min) },
                            ]}
                        >
                            {spot.waveHeight.humanRelation}
                        </Text>
                    ) : (
                        <View style={styles.placeholderWaveHeight} />
                    )}

                    <StarRating starCount={spot.starCount || 0} starSize={20} />
                </View>

                <View style={styles.rightContent}>
                    {spot.photo ? (
                        <Image
                            source={{ uri: spot.photo }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ) : null}
                </View>
            </View>

            <WaveHeightForecastsRow surf={spot.surf} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    beachCard: {
        marginBottom: 8,
        backgroundColor: "white",
        borderRadius: 8,
        overflow: "hidden",
        flex: 1,
        width: "100%",
        padding: 12,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "strech",
    },
    topContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    leftContent: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
    },
    placeholderTitle: {
        height: 20,
        backgroundColor: "#d3d3d3",
        borderRadius: 4,
        marginVertical: 4,
        width: "60%",
    },
    waveHeight: {
        borderRadius: 4,
        fontSize: 16,
        fontWeight: "bold",
    },
    placeholderWaveHeight: {
        height: 16,
        backgroundColor: "#d3d3d3",
        borderRadius: 4,
        width: "40%",
        marginVertical: 4,
    },
    rightContent: {
        flex: 1,
        maxWidth: 120,
        height: 80,
        alignItems: "flex-end",
        position: "relative",
        maxHeight: "100%",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
});

export default SpotForecastCard;
