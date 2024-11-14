/**
 * @fileoverview The API access for the beach locations on the map
 */

import { useContext, useState, useEffect } from "react";
import SettingsContext from "./SettingsContext";

const useMapAPI = () => {
    const { settings } = useContext(SettingsContext);
    const [spots, setSpots] = useState({});
    const [storedRegions, setStoredRegions] = useState([]);
    const [fetchRegionQueue, setFetchRegionQueue] = useState([]);

    /**
     * Get the next region in the queue to of regions to fetch.
     */
    const fetchSpots = async () => {
        if (fetchRegionQueue.length === 0) return;

        const { top, bottom, left, right } = fetchRegionQueue[0];
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
            data.data.spots.forEach(newSpot => {
                newSpots[newSpot._id] = newSpot;
            });
            return newSpots;
        });
        
        setFetchRegionQueue(fetchRegionQueue.slice(1));
    };
    
    useEffect(() => {
        fetchSpots();
    }, [fetchRegionQueue]);

    /**
     * Gets the spots for a region, and adds it to the spot list, but only if the region hasn't already been requested recently (eg, zooming in).
     * 
     * @param {object} region - containing the lat/long and delta of the region to request from the API
     */
    const getSpotsForRegion = (region) => {
        const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

        const top = latitude + latitudeDelta / 2;
        const bottom = latitude - latitudeDelta / 2;
        const left = longitude - longitudeDelta / 2;
        const right = longitude + longitudeDelta / 2;

        console.log(latitudeDelta, longitudeDelta);

        let shouldFetchThisRegion = true;
        for (const storedRegion of storedRegions) {
            if (storedRegion.top === top && storedRegion.bottom === bottom && storedRegion.left === left && storedRegion.right === right) {
                shouldFetchThisRegion = false;
                break;
            }
        }

        if (shouldFetchThisRegion) {
            setFetchRegionQueue([...fetchRegionQueue, { top, bottom, left, right }]);
            setStoredRegions([...storedRegions, { top, bottom, left, right }]);
        }
    };

    return { spots, getSpotsForRegion };
};

export default useMapAPI;
