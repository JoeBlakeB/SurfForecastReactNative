/**
 * @fileoverview A single spot card to be used within a list on the spot guide screen.
 */

import { Text, TouchableOpacity, Image, StyleSheet, View } from "react-native";
import StarRating from "./StarRating";
import { waveHeightToColour } from "./Utils";

/**
 * @param {Spot} spot the spot to show on the card
 */
function SpotForecastCard({ spot }) {
    return (
        <TouchableOpacity
            style={styles.beachCard}
            delayPressIn={50}
            activeOpacity={0.9}
        >
            <View style={styles.leftContent}>
                <Text style={styles.title}>{spot.name}</Text>
                <Text style={[
                    styles.waveHeight,
                    {color: waveHeightToColour(spot.waveHeight?.min)}
                ]}>
                    {spot.waveHeight?.humanRelation}
                </Text>
                <StarRating waveRating={spot.rating} starSize={20} />
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
        maxHeight: 110,
        padding: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
    waveHeight: {
        borderRadius: 4,
        fontSize: 16,
        fontWeight: "bold",
    },
    rightContent: {
        width: 100,
        alignItems: "flex-end",
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
});

export default SpotForecastCard;
