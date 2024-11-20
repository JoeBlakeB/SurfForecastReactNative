/**
 * @fileoverview A single spot card to be used within a list on the explore screen.
 */

import React from "react";
import { Text, TouchableOpacity, Image, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import StarRating from "./StarRating";

/**
 * @param {Spot} spot the spot to show on the card
 */
function BeachCard({ spot }) {
    return (
        <TouchableOpacity
            style={styles.beachCard}
            delayPressIn={50}
            activeOpacity={0.9}
        >
            <View style={styles.rowFlex}>
                <Text style={styles.title}>{spot.name}</Text>
                <StarRating waveRating={ spot.rating } />
            </View>
            <View style={styles.imageContainer}>
                {spot.photo !== null ? (
                    <Image
                    source={{ uri: spot.photo }}
                    style={styles.image}
                    resizeMode="cover"
                    />
                ) : (
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            region={{
                                latitude: spot.lat,
                                longitude: spot.lon,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005,
                            }}
                            mapType="satellite"
                            scrollEnabled={false}
                            zoomEnabled={false}
                        />
                        <Text style={styles.noCamerasText}>No Cameras Available</Text>
                    </View>
                )}
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
    },
    rowFlex: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
    },
    imageContainer: {
        flex: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    noCamerasText: {
        position: "absolute",
        bottom: 8,
        right: 8,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "#fff",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default BeachCard;
