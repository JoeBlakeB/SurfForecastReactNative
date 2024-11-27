/**
 * @fileoverview This is the favorite locations tab screen, the home page, which shows the users saved locations
 */

import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import SettingsContext from "../components/data/SettingsContext";
import SpotAPIContext from "../components/data/SpotAPIContext";
import SpotForecastCard from "../components/SpotForecastCard";

function SpotsScreen() {
    const { settings } = useContext(SettingsContext);
    const { spotAPI } = useContext(SpotAPIContext)

    useEffect(() => {
        spotAPI.getReportsForSpots(settings.favoriteSpots);
    }, [settings.favoriteSpots]);

    return (
        <View style={styles.container}>
            {settings.favoriteSpots.map((spotID) => (
                <SpotForecastCard
                    key={spotID}
                    spot={spotAPI.getSpot(spotID)}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e9e9e9",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
    },
});

export default SpotsScreen;
