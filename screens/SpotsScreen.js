/**
 * @fileoverview This is the favorite locations tab screen, the home page, which shows the users saved locations
 */

import { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import SettingsContext from "../components/data/SettingsContext";
import SpotAPIContext from "../components/data/SpotAPIContext";
import BeachCard from "../components/BeachCard";

function SpotsScreen() {
    const { settings } = useContext(SettingsContext);
    const { spotAPI } = useContext(SpotAPIContext)

    useEffect(() => {
        spotAPI.getReportsForSpots(settings.favoriteSpots);
    }, [settings.favoriteSpots]);

    return (
        <View style={styles.container}>
            {settings.favoriteSpots.map((spotID) => (
                <BeachCard
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
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default SpotsScreen;
