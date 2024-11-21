/**
 * @fileoverview This is the explore tab screen, with a map for discovering new places to go
 */

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Carousel from "react-native-reanimated-carousel";
import useMapAPI from "../components/MapAPI";
import BeachCard from "../components/BeachCard";

const TALBOT_CAMPUS_LOCATION = { coords: { latitude: 50.7415, longitude: -1.8946, latitudeDelta: 0.5, longitudeDelta: 0.5 } };

const { width: screenWidth } = Dimensions.get("window");

function ExploreScreen() {
    const [location, setLocation] = useState(TALBOT_CAMPUS_LOCATION.coords);
    const [selectedBeach, setSelectedBeach] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
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
    
    const onCarouselItemChange = (index) => {
        const spot = Object.values(spots)[index];
        setLocation({
            latitude: spot.lat,
            longitude: spot.lon,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
        });

        setCurrentIndex(index);
    };

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
                toolbarEnabled={false}
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

            {spots && (<View style={styles.carouselContainer}>
                <Carousel
                    data={Object.values(spots)}
                    renderItem={({ item, index }) => {return (Math.abs(currentIndex - index) <= 2) ? (
                            <BeachCard
                                spot={item}
                                renderMedia={Math.abs(currentIndex - index) <= 1}
                            />
                        ) : (null)}}
                    width={screenWidth}
                    height={250}
                    onSnapToItem={onCarouselItemChange}
                    loop={false}
                    mode={"parallax"}
                    defaultIndex={0}
                    modeConfig={{
                        parallaxScrollingScale: 0.9,
                        parallaxScrollingOffset: 52,
                    }}
                />
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
    carouselContainer: {
        height: 240,
        width: "100%",
        backgroundColor: "#e2e2e2",
    },
});

export default ExploreScreen;
