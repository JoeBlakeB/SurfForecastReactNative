/**
 * @fileoverview The main entrypoint for the app with the tab navigator.
 */

import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AccountScreen from "./screens/AccountScreen";
import ExploreScreen from "./screens/ExploreScreen";
import SpotsScreen from "./screens/SpotsScreen";
import NewsScreen from "./screens/NewsScreen";
import { SettingsProvider } from "./components/data/SettingsContext";
import { SpotAPIProvider } from "./components/data/SpotAPIContext";

const Tab = createMaterialBottomTabNavigator();

/**
 * Returns the generator for a tab button icon
 *
 * @param {string} iconNameFocused - The icon name to display when focused.
 * @param {string} iconNameUnfocused - The icon name to display when not focused.
 * @returns {function} A function that takes focus and color as props and renders the correct icon
 */
const TabIcon = (Component, iconNameFocused, iconNameUnfocused) => {
    return ({ focused, color }) => {
        const iconName = focused ? iconNameFocused : iconNameUnfocused;
        return <Component name={iconName} size={24} color={color} />;
    };
};

/**
 * The main tab navigator with icons on the bottom of the screen.
 * 
 * @return {React.ReactElement}
 */
export default function App() {
    return (
        <SettingsProvider>
            <SpotAPIProvider>
                <NavigationContainer>
                    <Tab.Navigator>
                        <Tab.Screen name="Spots" component={SpotsScreen} options={{tabBarIcon: TabIcon(Ionicons, "location", "location-outline")}}/>
                        <Tab.Screen name="Explore" component={ExploreScreen} options={{tabBarIcon: TabIcon(Ionicons, "map", "map-outline")}}/>
                        <Tab.Screen name="News" component={NewsScreen} options={{tabBarIcon: TabIcon(Ionicons, "newspaper", "newspaper-outline")}}/>
                        <Tab.Screen name="Account" component={AccountScreen} options={{tabBarIcon: TabIcon(Ionicons, "settings-sharp", "settings-outline")}}/>
                    </Tab.Navigator>
                </NavigationContainer>
            </SpotAPIProvider>
        </SettingsProvider>
    );
}
