/**
 * @fileoverview This is the explore tab screen, with a map for discovering new places to go
 */

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView} from "react-native-safe-area-context";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import useMapAPI from "../components/MapAPI";
import BeachCard from "../components/BeachCard";

const TALBOT_CAMPUS_LOCATION = { coords: { latitude: 50.7415, longitude: -1.8946, latitudeDelta: 0.5, longitudeDelta: 0.5 } };

function ExploreScreen() {
    const [location, setLocation] = useState(TALBOT_CAMPUS_LOCATION.coords);
    const [selectedBeach, setSelectedBeach] = useState(null);
    const { spots, getSpotsForRegion } = useMapAPI();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const userLocation = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                    latitudeDelta: TALBOT_CAMPUS_LOCATION.coords.latitudeDelta,
                    longitudeDelta: TALBOT_CAMPUS_LOCATION.coords.longitudeDelta,
                });
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={location}
                onRegionChangeComplete={getSpotsForRegion}
                showsUserLocation={true}
                loadingEnabled={true}
                scrollEnabled={true}
                rotateEnabled={false}
                pitchEnabled={false}
                showsPointsOfInterest={false}
                userLocationPriority={"low"}
                showsMyLocationButton={false}
                mapType={"hybrid"}
                minZoomLevel={6}
                maxZoomLevel={15}
            >
                {Object.values(spots).map((spot) => (
                    <Marker
                        key={spot.id}
                        coordinate={{ latitude: spot.lat, longitude: spot.lon }}
                        title={spot.name}
                        onPress={() => setSelectedBeach(spot)}
                    />
                ))}
            </MapView>

            {selectedBeach && (
                <View style={styles.detailsContainer}>
                    <BeachCard spot={selectedBeach} />
                </View>
            )}
        </View>
    );  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    detailsContainer: {
        height: 260,
        padding: 20,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
});

export default ExploreScreen;
