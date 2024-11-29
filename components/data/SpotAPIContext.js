/**
 * @fileoverview This file provides a context for accessing Surfline's API for spot data
 */

import { createContext, useContext, useState, useEffect } from "react";
import SettingsContext from "./SettingsContext";

const GET_EXTRA_DELTA = 0.4;

/**
 * How many stars should be given for each of Surfline's ratings
 * 
 * information about the surfline surf quality scale at
 * https://www.surfline.com/surf-news/surflines-rating-surf-heights-quality/1417
 */
const RATINGS_STAR_COUNT = {
    FLAT: 0,
    VERY_POOR: 0.5,
    POOR: 1,
    POOR_TO_FAIR: 2,
    FAIR: 3,
    FAIR_TO_GOOD: 3.5,
    GOOD: 4,
    VERY_GOOD: 4.5,
    GOOD_TO_EPIC: 4.5,
    EPIC: 5,
};

const STARTUP_DATE = new Date();
/** Include the current date&hour to stop showing old images */
const IMAGE_TIMESTAMP = `?${STARTUP_DATE.getFullYear()}${String(STARTUP_DATE.getMonth() + 1).padStart(2, '0')}${String(STARTUP_DATE.getDate()).padStart(2, '0')}${String(STARTUP_DATE.getHours()).padStart(2, '0')}`;

/**
 * Class for creating a consistent data structure from Surfline's slightly inconsistent API.
 */
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

    /**
     * Set the data from the mapview or single spot endpoints.
     * 
     * @param {Object} data the data.spot of the response
     */
    update(data) {
        let spot, forecast;
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
        this.photo = spot.cameras.length > 0 ? spot.cameras[0].stillUrlFull + IMAGE_TIMESTAMP : null;
        this.rating = forecast.conditions.value;
        this.starCount = RATINGS_STAR_COUNT[forecast.conditions.value];
        this.waveHeight = {
            min: forecast.waveHeight.min,
            max: forecast.waveHeight.max,
            humanRelation: forecast.waveHeight.humanRelation,
        };
    }

    /**
     * Set the data from the surf endpoint.
     * 
     * @param {Object} data the data.surf of the response
     */
    setSurfData(data) {
        let surf = [];
        for (let i = 0; i + 3 < data.length; i += 4) {
            const min = Math.min(
                this.waveHeight.min,
                data[i+1].surf.min,
                data[i+2].surf.min,
                data[i+3].surf.min);
            let max = this.waveHeight.max;
            let maxPlus = false;

            for (let j = i+1; j <= i+3; j++) {
                if (data[j].surf.max >= max) {
                    max = data[j].surf.max;
                    maxPlus |= data[j].surf.plus;
                }
            }

            surf.push({
                morning: {
                    min: data[i+1].surf.min,
                    max: data[i+1].surf.max,
                },
                noon: {
                    min: data[i+2].surf.min,
                    max: data[i+2].surf.max,
                },
                night: {
                    min: data[i+3].surf.min,
                    max: data[i+3].surf.max,
                },
                all: {
                    min: min,
                    max: max,
                    maxPlus: maxPlus,
                }
            });
        }
        
        this.surf = surf;
    }
};

/**
 * Dummy data generator for consistent fake data for an apps use.
 */
const DEMO_SPOTS = (() => {
    let spots = {};
    const possibleWaveHeights = ["Thigh Highs", "Head High", "Overhead", "You're gonna drown lol"];

    const generateWaveHeights = () => {
        min = Math.floor(Math.random() * 10);
        max = min + Math.floor(Math.random() * 3);
        return {min: min, max: max};
    }

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
        spot.conditions = {value: Object.keys(RATINGS_STAR_COUNT)[Math.floor(Math.random() * Object.keys(RATINGS_STAR_COUNT).length)]};

        spot.waveHeight = {
            ...generateWaveHeights(),
            humanRelation: possibleWaveHeights[Math.floor(Math.random() * possibleWaveHeights.length)]
        };

        spots[spot._id] = new Spot(spot);

        surfData = [];
        for (let i = 0; i < 5; i++) {
            const day = {
                morning: generateWaveHeights(),
                noon: generateWaveHeights(),
                night: generateWaveHeights(),
            }
            day.all = {
                min: Math.min(day.morning.min, day.noon.min, day.night.min),
                max: Math.max(day.morning.max, day.noon.max, day.night.max),
                maxPlus: Math.random() > 0.8,
            };
            surfData.push(day);
        }

        spots[spot._id].surf = surfData;
    }

    return spots;
})();

export const SpotAPIContext = createContext();

/**
 * Provide the SpotAPI for the rest of the app.
 * 
 * @returns {React.ReactElement} the children with the SpotAPI provided
 */
export const SpotAPIProvider = ({ children }) => {
    const { settings } = useContext(SettingsContext);
    const [storedRegions, setStoredRegions] = useState([]);
    const [fetchRegionQueue, setFetchRegionQueue] = useState([]);
    const [storedReports, setStoredReports] = useState([]);
    const [fetchReportQueue, setFetchReportQueue] = useState([]);
    const [fetchReportsInProgress, setFetchReportsInProgress] = useState([]);

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
            if (storedRegion.top >= needed.top && storedRegion.bottom <= needed.bottom && storedRegion.left <= needed.left && storedRegion.right >= needed.right) {
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
        setFetchReportsInProgress([...fetchReportsInProgress, spotID]);
        const reportURL = `https://services.surfline.com/kbyg/spots/reports?spotId=${spotID}`;
        const reportResponse = await fetch(reportURL);
        if (reportResponse.status !== 200) {
            console.error("Error fetching spot report:", reportResponse.status, reportURL);
            setFetchReportsInProgress(fetchReportsInProgress.filter(item => item !== spotID));
            return;
        }

        const reportData = await reportResponse.json();

        setSpots(prevSpots => {
            const newSpots = { ...prevSpots };
            if (newSpots[spotID]) {
                newSpots[spotID].update(reportData);
            } else {
                newSpots[spotID] = new Spot(reportData);
            }
            return newSpots;
        });

        const surfURL = `https://services.surfline.com/kbyg/spots/forecasts/surf?days=5&intervalHours=6&spotId=${spotID}`;
        const surfResponse = await fetch(surfURL);
        if (surfResponse.status !== 200) {
            console.error("Error fetching spot surf:", surfResponse.status, surfURL);
            setFetchReportsInProgress(fetchReportsInProgress.filter(item => item !== spotID));
            return;
        }

        const surfData = await surfResponse.json();

        setSpots(prevSpots => {
            const newSpots = { ...prevSpots };
            if (newSpots[spotID]) {
                newSpots[spotID].setSurfData(surfData.data.surf);
            }
            return newSpots;
        });

        setStoredReports([...storedReports, spotID]);
        setFetchReportsInProgress(fetchReportsInProgress.filter(item => item !== spotID));
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
                if (!newQueue.includes(spotID) && !storedReports.includes(spotID) && !fetchReportsInProgress.includes(spotID)) {
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
        storedReports, fetchReportsInProgress, storedRegions,
    };

    return (
        <SpotAPIContext.Provider value={{ spotAPI }}>
            {children}
        </SpotAPIContext.Provider>
    );
};

export default SpotAPIContext;
