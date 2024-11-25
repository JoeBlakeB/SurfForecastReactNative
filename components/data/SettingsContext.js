/**
 * @fileoverview This file provides a settings context for managing the users preferences,
 * which are instantly reflected within all components.
 */

import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [useRealAPI, setUseRealAPI] = useState(true);
    const [favoriteSpots, setFavoriteSpots] = useState([]);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedUseRealAPI = await AsyncStorage.getItem("useRealAPI");
                setUseRealAPI(savedUseRealAPI !== null ? JSON.parse(savedUseRealAPI) : true);

                const savedFavorites = await AsyncStorage.getItem("favoriteSpots");
                setFavoriteSpots(savedFavorites ? JSON.parse(savedFavorites) : []);
            } catch (error) {
                console.error("Failed to load settings from storage:", error);
            }
        };
        loadSettings();
    }, []);

    const toggleUseRealAPI = async () => {
        const newValue = !useRealAPI;
        setUseRealAPI(newValue);
        await AsyncStorage.setItem("useRealAPI", JSON.stringify(newValue));
    };

    const updateFavorites = async (newFavorites) => {
        setFavoriteSpots(newFavorites);
        await AsyncStorage.setItem("favoriteSpots", JSON.stringify(newFavorites));
    };

    const settings = {
        useRealAPI, toggleUseRealAPI,
        favoriteSpots, updateFavorites,
    };

    return (
        <SettingsContext.Provider value={{ settings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;
