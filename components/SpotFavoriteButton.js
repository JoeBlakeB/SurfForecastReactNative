/**
 * @fileoverview The favorite button for the BeachCard
 */

import { useContext, useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { SettingsContext } from "./data/SettingsContext";

/**
 * @param {string} spotID the spotID for a surfline Spot
 * @param {Object} style the style for the buttons container
 */
function SpotFavoriteButton({ spotID, style }) {
    const { settings } = useContext(SettingsContext);
    const [isFavorite, setIsFavorite] = useState(false);
    
    const handleFavoriteToggle = async () => {
        const newFavorites = isFavorite
        ? settings.favoriteSpots.filter(id => id !== spotID) 
        : [...settings.favoriteSpots, spotID];
        settings.updateFavorites(newFavorites);
    };

    useEffect(() => {
        setIsFavorite(settings.favoriteSpots.includes(spotID));
    }, [settings.favoriteSpots, spotID]);

    return (
        <View style={style}>
            <TouchableOpacity
                style={[isFavorite ? styles.saved : styles.unsaved, styles.button]}
                onPress={handleFavoriteToggle}
            >
                <AntDesign
                    size={40}
                    name={isFavorite ? "heart" : "hearto"}
                    color={isFavorite ? "red" : "white"}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 16,
        padding: 8,
    },
    saved: {
        backgroundColor: "rgba(200, 0, 0, 0.25)",
    },
    unsaved: {
        backgroundColor: "rgba(0, 0, 0, 0.25)",
    }
});

export default SpotFavoriteButton;
