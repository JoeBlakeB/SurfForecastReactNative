/**
 * @fileoverview This file provides a context for accessing Surfline's API for spot data
 */

import { createContext, useContext, useState, useEffect } from "react";
import SettingsContext from "./SettingsContext";

const GET_EXTRA_DELTA = 0.4;

const DEMO_SPOTS = [
    {
        id: "61395abb84ce2eb3d50066c8",
        name: "Swanage",
        lat: 50.613,
        lon: -1.956,
    },
    {
        id: "584204214e65fad6a7709cf4",
        name: "Bournemouth",
        lat: 50.713,
        lon: -1.877,
        rating: "POOR"
    },
    {
        id: "584204214e65fad6a7709cee",
        name: "Boscombe",
        lat: 50.717,
        lon: -1.835,
        rating: "FLAT"
    },
    {
        id: "613ba68936d5112d6d6b38b3",
        name: "Milford on Sea",
        lat: 50.720,
        lon: -1.592,
        rating: "FAIR"
    },
    {
        id: "613a73bdd66c4039f3633bcc",
        name: "Mudeford Harbour",
        lat: 50.726,
        lon: -1.743,
        rating: "FAIR_TO_GOOD"
    }
];

class Spot {
    constructor(spot) {
        this.id = spot._id;
        this.name = spot.name;
        this.lat = spot.lat;
        this.lon = spot.lon;
        this.photo = spot.cameras.length > 0 ? spot.cameras[0].stillUrlFull : null;
        this.rating = spot.conditions.value;
    }

    update(spot) {
        this.rating = spot.conditions.value;
    }
};

export const SpotAPIContext = createContext();

export const SpotAPIProvider = ({ children }) => {
    const { settings } = useContext(SettingsContext);
    const [storedRegions, setStoredRegions] = useState([]);
    const [fetchRegionQueue, setFetchRegionQueue] = useState([]);

    /**
     * @property {Object} spots an object with Spot objects with their id as the key
     */
    const [spots, setSpots] = useState({});


    /**
     * Get the next region in the queue to of regions to fetch.
     */
    const fetchSpots = async () => {
        if (fetchRegionQueue.length === 0) return;

        if (settings.useRealAPI) {
            const { top, bottom, left, right } = fetchRegionQueue[fetchRegionQueue.length - 1];
            const response = await fetch(
                `https://services.surfline.com/kbyg/mapview?north=${top}&south=${bottom}&west=${left}&east=${right}`,
            );
            if (response.status !== 200) {
                console.error("Error fetching spots:", response.status);
                return;
            }

            const data = await response.json();
            
            setSpots(prevSpots => {
                const newSpots = { ...prevSpots };
                data.data.spots.forEach(spotData => {
                    if (newSpots[spotData._id]) {
                        newSpots[spotData._id].update(spotData);
                    } else {
                        newSpots[spotData._id] = new Spot(spotData);
                    }
                });
                return newSpots;
            });
        } else {
            setSpots(DEMO_SPOTS);
            setStoredRegions([]);
        }

        setFetchRegionQueue(fetchRegionQueue.slice(0, -1));
    };

    useEffect(() => {
        fetchSpots();
    }, [fetchRegionQueue]);

    /**
     * Gets the spots for a region, and adds it to the spot list, but only if the region hasn't already been requested recently (eg, zooming in).
     * Also gets a bit extra either side, for when the user is zoomed in and is moving around slowly.
     * 
     * @param {object} region - containing the lat/long and delta of the region to request from the API
     */
    const getSpotsForRegion = (region) => {
        const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

        const needed = {
            top: latitude + latitudeDelta / 2,
            bottom: latitude - latitudeDelta / 2,
            left: longitude - longitudeDelta / 2,
            right: longitude + longitudeDelta / 2
        };

        const toRequest = {
            top: needed.top + GET_EXTRA_DELTA,
            bottom: needed.bottom - GET_EXTRA_DELTA,
            left: needed.left - GET_EXTRA_DELTA,
            right: needed.right + GET_EXTRA_DELTA
        };

        let shouldFetchThisRegion = true;
        for (const storedRegion of storedRegions) {
            if (storedRegion.top === needed.top && storedRegion.bottom === needed.bottom && storedRegion.left === needed.left && storedRegion.right === needed.right) {
                shouldFetchThisRegion = false;
                break;
            }
        }

        if (shouldFetchThisRegion) {
            setFetchRegionQueue([...fetchRegionQueue, toRequest]);
            setStoredRegions([...storedRegions, toRequest]);
        }
    };

    const spotAPI = {
        spots,
        getSpotsForRegion
    };

    return (
        <SpotAPIContext.Provider value={{ spotAPI }}>
            {children}
        </SpotAPIContext.Provider>
    );
};

export default SpotAPIContext;
