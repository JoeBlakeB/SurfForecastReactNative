/**
 * @fileoverview The favorite button for the BeachCard and can be reused in other places.
 */

import { useContext, useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { SettingsContext } from "./data/SettingsContext";

/**
 * A favorite button for a spot which can be tweaked for different use cases
 * 
 * @param {string} spotID the spotID for a surfline Spot
 * @param {Object} style the style for the buttons container
 * @param {Object} savedStyle the style for the button when it is saved
 * @param {Object} unsavedStyle the style for the button when it is not saved
 * @param {number} size the size of the heart
 * @returns {React.ReactElement}
 */
function SpotFavoriteButton({ spotID, style, savedStyle=styles.saved, unsavedStyle=styles.unsaved, size=40 }) {
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
                style={[isFavorite ? savedStyle : unsavedStyle, styles.button]}
                onPress={handleFavoriteToggle}
            >
                <AntDesign
                    size={size}
                    name={isFavorite ? "heart" : "hearto"}
                    color={isFavorite ? savedStyle.color : unsavedStyle.color}
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
        color: "red",
    },
    unsaved: {
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        color: "white",
    }
});

export default SpotFavoriteButton;
