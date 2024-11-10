/**
 * @fileoverview This file provides a settings context for managing the users preferences,
 * which are instantly reflected within all components.
 */

import React, {createContext, useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [useRealAPI, setUseRealAPI] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedUseRealAPI = await AsyncStorage.getItem("useRealAPI");
                setUseRealAPI(savedUseRealAPI !== null ? JSON.parse(savedUseRealAPI) : true);
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

    const settings = {useRealAPI, toggleUseRealAPI};

    return (
        <SettingsContext.Provider value={{ settings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;
