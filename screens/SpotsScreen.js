/**
 * @fileoverview This is the favorite locations tab screen, the home page, which shows the users saved locations
 */

import { useContext, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsContext from "../components/data/SettingsContext";
import SpotAPIContext from "../components/data/SpotAPIContext";
import SpotForecastCard from "../components/SpotForecastCard";

function SpotsScreen() {
    const { settings } = useContext(SettingsContext);
    const { spotAPI } = useContext(SpotAPIContext);

    useEffect(() => {
        spotAPI.getReportsForSpots(settings.favoriteSpots);
    }, [settings.favoriteSpots, settings.useRealAPI]);

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.heading}>Favorite Spots</Text>
                <View style={styles.container}>
                    {settings.favoriteSpots.map((spotID) => (
                        <SpotForecastCard
                            key={spotID}
                            spot={spotAPI.getSpot(spotID)}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: "#e9e9e9",
    },
    container: {
        paddingHorizontal: 8,
        paddingBottom: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 4,
        marginBottom: 16,
        color: "#333",
    },
});

export default SpotsScreen;
