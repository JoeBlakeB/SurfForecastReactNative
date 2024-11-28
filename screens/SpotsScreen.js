/**
 * @fileoverview This is the favorite locations tab screen, the home page, which shows the users saved locations
 */

import { useContext, useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native"
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import SettingsContext from "../components/data/SettingsContext";
import SpotAPIContext from "../components/data/SpotAPIContext";
import SpotForecastCard from "../components/SpotForecastCard";
import { TALBOT_CAMPUS_LOCATION } from "../components/Utils";

function SpotsScreen() {
    const { settings } = useContext(SettingsContext);
    const { spotAPI } = useContext(SpotAPIContext);
    const [nearbyLocationsRetrieved, setNearbyLocationsRetrieved] = useState(false);
    const [featuredSpots, setFeaturedSpots] = useState(undefined);

    useEffect(() => {
        spotAPI.getReportsForSpots(settings.favoriteSpots);
    }, [settings.favoriteSpots, settings.useRealAPI]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            let userLocation;
            if (status === "granted") {
                userLocation = await Location.getCurrentPositionAsync({});
            } else {
                userLocation = TALBOT_CAMPUS_LOCATION;
            }

            spotAPI.getSpotsForRegion({
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 1.6,
                longitudeDelta: 0.8,
            });

            setNearbyLocationsRetrieved(true);
        })();
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (!nearbyLocationsRetrieved)
                return;

            const spots = Object.values(spotAPI.spots)
                .filter(spot => !settings.favoriteSpots.includes(spot.id))
                .sort((a, b) => (
                    (b.starCount - a.starCount) * 6) +
                    (b.waveHeight.min - a.waveHeight.min) +
                    (b.waveHeight.max - a.waveHeight.max))
                .slice(0, 5);

            spotAPI.getReportsForSpots(spots.map(spot => spot.id));
            setFeaturedSpots(spots);
        }, [spotAPI.spots, settings.favoriteSpots])
    );

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView style={styles.scrollContainer}>
                {settings.favoriteSpots.length > 0 && (
                    <Text style={styles.heading}>Favorite Spots</Text>
                )}
                <View style={styles.container}>
                    {settings.favoriteSpots.map((spotID) => (
                        <SpotForecastCard
                            key={spotID}
                            spot={spotAPI.getSpot(spotID)}
                        />
                    ))}
                </View>

                {featuredSpots?.length > 0 && (
                    <Text style={styles.heading}>Featured Spots</Text>
                )}
                <View style={styles.container}>
                    {featuredSpots?.map((spot) => (
                        <SpotForecastCard
                        key={spot.id}
                        spot={spot}
                        />
                    ))}
                </View>

                {settings.favoriteSpots.length === 0 && featuredSpots?.length === 0 && (
                    <Text style={styles.emptyMessage}>
                        It looks like you haven't found any spots yet. Start exploring to find some.
                    </Text>
                )}
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
        paddingBottom: 8,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 4,
        marginBottom: 16,
        color: "#333",
    },
    emptyMessage: {
        fontSize: 16,
        textAlign: "center",
        color: "#666",
        marginHorizontal: 16,
        marginVertical: 8,
    },
});

export default SpotsScreen;
