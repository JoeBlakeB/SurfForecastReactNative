import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import AccountScreen from "./screens/AccountScreen";
import ExploreScreen from "./screens/ExploreScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import NewsScreen from "./screens/NewsScreen";

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

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Favorites" component={FavoritesScreen} options={{tabBarIcon: TabIcon(AntDesign, "star", "staro")}}/>
                <Tab.Screen name="Explore" component={ExploreScreen} options={{tabBarIcon: TabIcon(Ionicons, "map", "map-outline")}}/>
                <Tab.Screen name="News" component={NewsScreen} options={{tabBarIcon: TabIcon(Ionicons, "newspaper", "newspaper-outline")}}/>
                <Tab.Screen name="Account" component={AccountScreen} options={{tabBarIcon: TabIcon(Ionicons, "settings-sharp", "settings-outline")}}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
});
