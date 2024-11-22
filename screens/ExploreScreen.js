/**
 * @fileoverview This is the explore tab screen, with a map for discovering new places to go
 */

import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Carousel from "react-native-reanimated-carousel";
import useMapAPI from "../components/MapAPI";
import BeachCard from "../components/BeachCard";

const TALBOT_CAMPUS_LOCATION = { coords: { latitude: 50.7415, longitude: -1.8946, latitudeDelta: 0.5, longitudeDelta: 0.5 } };

const { width: screenWidth } = Dimensions.get("window");

/**
 * Determine the great-circle distance between two locations
 * 
 * @param {Object} location1 The first location, containing .lat and .lon
 * @param {Object} location2 The second location, containing .lat and .lon
 * @returns {number} The distance in radians between the two locations in radians
 */
function haversine(location1, location2) {
    const dLat = (location2.lat - location1.lat) * Math.PI / 180;
    const dLon = (location2.lon - location1.lon) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(location1.lat * Math.PI / 180) * Math.cos(location2.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function ExploreScreen() {
    const [userLocation, setUserLocation] = useState({lat: TALBOT_CAMPUS_LOCATION.coords.latitude, lon: TALBOT_CAMPUS_LOCATION.coords.longitude});
    const [location, setLocation] = useState(TALBOT_CAMPUS_LOCATION.coords);
    const [selectMarkerRefPending, setSelectMarkerRefPending] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sortedSpots, setSortedSpots] = useState([]);
    const { spots, getSpotsForRegion } = useMapAPI();
    const carouselRef = useRef(null);
    const markerRefs = useRef({});

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
                setUserLocation({
                    lat: userLocation.coords.latitude,
                    lon: userLocation.coords.longitude,
                });
            }
        })();
    }, []);

    /**
     * Sort the spots by their distance from the current location
     */
    useEffect(() => {
        if (userLocation) {
            const sorted = Object.values(spots)
                .map(spot => ({
                    ...spot,
                    distance: haversine(userLocation, spot),
                }))
                .sort((a, b) => a.distance - b.distance);
            setSortedSpots(sorted);
        }
    }, [userLocation, spots]);

    /**
     * Go to the correct spot on the map going to another location on the carousel
     * 
     * @param {number} index of the current item in the carousel 
     */
    const onCarouselSnapToItem = (index) => {
        const spot = Object.values(sortedSpots)[index];
        setLocation({
            latitude: spot.lat,
            longitude: spot.lon,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
        });

        setCurrentIndex(index);

        const showMarkerCallout = () => {
            setSelectMarkerRefPending(spot.id);
            const markerRef = markerRefs.current[spot.id];
            if (markerRef) {
                markerRef.showCallout();
            }
        };
        
        showMarkerCallout();
        setTimeout(showMarkerCallout, 500); 
    };

    /**
     * Go to the correct spot on the carousel selecting one on the map
     * 
     * @param {Spot} spot selected on the map
     */
    const onMarkerPress = (spot) => {
        const index = Object.values(sortedSpots).findIndex((s) => s.id === spot.id);
        if (index !== -1) {
            setCurrentIndex(index);
            carouselRef.current?.scrollTo({ index });
        }
    }

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
                        onPress={() => onMarkerPress(spot)}
                        ref={(ref) => {
                            if (ref) markerRefs.current[spot.id] = ref;
                        }}
                    />
                ))}
            </MapView>

            {spots && (<View style={styles.carouselContainer}>
                <Carousel
                    ref={carouselRef}
                    data={Object.values(sortedSpots)}
                    renderItem={({ item, index }) => {return (Math.abs(currentIndex - index) <= 2) ? (
                            <BeachCard
                                spot={item}
                                renderMedia={Math.abs(currentIndex - index) <= 1}
                            />
                        ) : (null)}}
                    width={screenWidth}
                    height={250}
                    onSnapToItem={onCarouselSnapToItem}
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
