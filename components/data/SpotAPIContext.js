/**
 * @fileoverview This file provides a context for accessing Surfline's API for spot data
 */

import { createContext, useContext, useState, useEffect } from "react";
import SettingsContext from "./SettingsContext";

const GET_EXTRA_DELTA = 0.4;

class Spot {
    constructor(data) {
        if (typeof data === "string") {
            this.id = data;
            return;
        }

        let spot;
        if (data._id === undefined && data.spot !== undefined) {
            spot = data.spot;
        } else {
            spot = data;
        }

        this.id = spot._id;
        this.update(data);
    }

    update(data) {
        let spot, conditions;
        if (data._id === undefined && data.spot !== undefined) {
            spot = data.spot;
            forecast = data.forecast;
        } else {
            spot = data;
            forecast = data;
        }

        this.name = spot.name;
        this.lat = spot.lat;
        this.lon = spot.lon;
        this.photo = spot.cameras.length > 0 ? spot.cameras[0].stillUrlFull : null;
        this.rating = forecast.conditions.value;
        this.waveHeight = {
            min: forecast.waveHeight.min,
            max: forecast.waveHeight.max,
            humanRelation: forecast.waveHeight.humanRelation,
        };
    }
};

const DEMO_SPOTS = (() => {
    let spots = {};
    const possibleRatings = ["FLAT", "POOR", "POOR_TO_FAIR", "FAIR", "GOOD", "EPIC"];
    const possibleWaveHeights = ["Thigh Highs", "Head High", "Overhead", "Your'e gonna drown lol"];

    for (let spot of [
        {
            _id: "61395abb84ce2eb3d50066c8",
            name: "Swanage",
            lat: 50.613,
            lon: -1.956,
        },
        {
            _id: "584204214e65fad6a7709cf4",
            name: "Bournemouth",
            lat: 50.713,
            lon: -1.877,
        },
        {
            _id: "584204214e65fad6a7709cee",
            name: "Boscombe",
            lat: 50.717,
            lon: -1.835,
        },
        {
            _id: "613ba68936d5112d6d6b38b3",
            name: "Milford on Sea",
            lat: 50.720,
            lon: -1.592,
        },
        {
            _id: "613a73bdd66c4039f3633bcc",
            name: "Mudeford Harbour",
            lat: 50.726,
            lon: -1.743,
        }
    ]) {
        spot.cameras = [];
        spot.conditions = {value: possibleRatings[Math.floor(Math.random() * possibleRatings.length)]};

        waveMin = Math.floor(Math.random() * 6) * 2;
        waveMax = waveMin + 2;
        spot.waveHeight = {
            min: waveMin,
            max: waveMax,
            humanRelation: possibleWaveHeights[Math.floor(Math.random() * possibleWaveHeights.length)]
        };

        spots[spot._id] = new Spot(spot);
    }

    return spots;
})();

export const SpotAPIContext = createContext();

export const SpotAPIProvider = ({ children }) => {
    const { settings } = useContext(SettingsContext);
    const [storedRegions, setStoredRegions] = useState([]);
    const [fetchRegionQueue, setFetchRegionQueue] = useState([]);
    const [storedReports, setStoredReports] = useState([]);
    const [fetchReportQueue, setFetchReportQueue] = useState([]);

    /**
     * @property {Object} spots an object with Spot objects with their id as the key
     */
    const [spots, setSpots] = useState({});

    /**
     * Get the next region in the queue to of regions to fetch.
     */
    const fetchRegionSpots = async () => {
        if (fetchRegionQueue.length === 0) return;

        const { top, bottom, left, right } = fetchRegionQueue[fetchRegionQueue.length - 1];
        const url = `https://services.surfline.com/kbyg/mapview?north=${top}&south=${bottom}&west=${left}&east=${right}`
        const response = await fetch(url);
        if (response.status !== 200) {
            console.error("Error fetching spots for region:", response.status, url);
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

        setStoredRegions([...storedRegions, fetchRegionQueue[fetchRegionQueue.length - 1]]);
        setFetchRegionQueue(fetchRegionQueue.slice(0, -1));
    };

    useEffect(() => {
        if (settings.useRealAPI) {
            fetchRegionSpots();
        } else {
            setSpots(DEMO_SPOTS);
            setStoredRegions([]);
        }
    }, [fetchRegionQueue, settings.useRealAPI]);

    /**
     * Gets the spots for a region, and adds it to the spot list, but only if the region hasn't already been requested recently (eg, zooming in).
     * Also gets a bit extra either side, for when the user is zoomed in and is moving around slowly.
     * 
     * @param {object} region containing the lat/long and delta of the region to request from the API
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
        for (const storedRegion of [...storedRegions, ...fetchRegionQueue]) {
            if (storedRegion.top === needed.top && storedRegion.bottom === needed.bottom && storedRegion.left === needed.left && storedRegion.right === needed.right) {
                shouldFetchThisRegion = false;
                break;
            }
        }

        if (shouldFetchThisRegion) {
            setFetchRegionQueue([...fetchRegionQueue, toRequest]);
        }
    };

    /**
     * Get the next spot report for the next spot in the queue.
     */
    const fetchReportForSpot = async () => {
        if (fetchReportQueue.length === 0) return;

        const spotID = fetchReportQueue[fetchReportQueue.length - 1];
        setFetchReportQueue(fetchReportQueue.slice(0, -1));
        const url = `https://services.surfline.com/kbyg/spots/reports?spotId=${spotID}`;
        const response = await fetch(url);
        if (response.status !== 200) {
            console.error("Error fetching spot report:", response.status, url);
            return;
        }

        setStoredReports([...storedReports, spotID]);
        const data = await response.json();

        setSpots(prevSpots => {
            const newSpots = { ...prevSpots };
            if (newSpots[spotID]) {
                newSpots[spotID].update(data);
            } else {
                newSpots[spotID] = new Spot(data);
            }
            return newSpots;
        });
    };

    useEffect(() => {
        if (settings.useRealAPI) {
            fetchReportForSpot();
        } else {
            setStoredReports([]);
        }
    }, [fetchReportQueue, settings.useRealAPI]);

    /**
     * Add the spot to the report request queue, if it is not already and hasn't been got yet.
     * 
     * @param {string} spotIDs corresponding to the Surfline spot
     */
    const getReportsForSpots = (spotIDs) => {
        setFetchReportQueue(fetchReportQueue => {
            const newQueue = [...fetchReportQueue];
            spotIDs.forEach(spotID => {
                if (!newQueue.includes(spotID) && !storedReports.includes(spotID)) {
                    newQueue.push(spotID);
                }
            });
            return newQueue;
        });
    };

    /**
     * Get a spot, or an empty id only object if it doesn't exist yet.
     * Does not request the spot, that must be done separately.
     * 
     * @param {string} spotID for the surfline spot 
     * @returns Spot with the data for that spot
     */
    const getSpot = (spotID) => {
        return spots[spotID] || new Spot(spotID);
    };

    const spotAPI = {
        spots, getSpot,
        getSpotsForRegion,
        getReportsForSpots,
    };

    return (
        <SpotAPIContext.Provider value={{ spotAPI }}>
            {children}
        </SpotAPIContext.Provider>
    );
};

export default SpotAPIContext;
