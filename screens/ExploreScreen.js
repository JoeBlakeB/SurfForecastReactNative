/**
 * @fileoverview This is the explore tab screen, with a map for discovering new places to go
 */

import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import useMapAPI from "../components/MapAPI";

const TALBOT_CAMPUS_LOCATION = { coords: { latitude: 50.7415, longitude: -1.8946, latitudeDelta: 0.1, longitudeDelta: 0.05 } };


function ExploreScreen() {
    const [location, setLocation] = useState(TALBOT_CAMPUS_LOCATION.coords);
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
                style={StyleSheet.absoluteFillObject}
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
                maxZoomLevel={11}
            >
                {Object.values(spots).map((spot) => (
                    <Marker
                        key={spot._id}
                        coordinate={{ latitude: spot.lat, longitude: spot.lon }}
                        title={spot.name}
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ExploreScreen;
