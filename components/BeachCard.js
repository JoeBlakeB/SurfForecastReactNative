/**
 * @fileoverview A single spot card to be used within a list on the explore screen.
 */

import { Text, TouchableOpacity, Image, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import StarRating from "./StarRating";
import { useContext, useState } from "react";
import { SettingsContext } from "./SettingsContext.js";
import FontAwesome from "react-native-vector-icons/AntDesign";

/**
 * @param {Spot} spot the spot to show on the card
 */
function BeachCard({ spot, renderMedia=true }) {
    const { settings } = useContext(SettingsContext);
    const [isFavorite, setIsFavorite] = useState(settings.favoriteSpots.includes(spot.id));

    const handleFavoriteToggle = async () => {
        const newFavorites = isFavorite
            ? settings.favoriteSpots.filter(id => id !== spot.id) 
            : [...settings.favoriteSpots, spot.id];
        
        await settings.updateFavorites(newFavorites);
        setIsFavorite(!isFavorite);
    };

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
                {spot.photo ? (
                    <Image
                        source={{ uri: renderMedia ? spot.photo : null }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : renderMedia ? (
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
                ) : null}

                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={handleFavoriteToggle}
                >
                    <FontAwesome name={isFavorite ? "heart" : "hearto"} size={40} color={isFavorite ? "red" : "white"} />
                </TouchableOpacity>
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
        position: "relative",
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
    favoriteButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        borderRadius: 16,
        padding: 8,
    },
});

export default BeachCard;
