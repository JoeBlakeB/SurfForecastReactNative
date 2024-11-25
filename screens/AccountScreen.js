/**
 * @fileoverview This is the account management tab screen, which shows the users account options
 */

import React, {useContext} from "react";
import { StyleSheet, Text, View, Switch, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import WebViewScreen, {WebViewTypes} from "./WebViewScreen";
import SettingsContext from "../components/data/SettingsContext";

const Stack = createStackNavigator();

function AccountScreen({ navigation }) {
    const { settings } = useContext(SettingsContext);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.option}>
                    <Text style={styles.optionText}>Use Real API</Text>
                    <Switch
                        value={settings.useRealAPI}
                        style={styles.switch}
                        onValueChange={() => {settings.toggleUseRealAPI()}}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Customer Support</Text>
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => navigation.navigate("WebViewScreen", { url: "https://www.surfline.com/terms-of-use", title: "Terms of Use" })}
                >
                    <Text style={styles.optionText}>Terms of Use</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => navigation.navigate("WebViewScreen", { url: "https://www.surfline.com/privacy-policy", title: "Privacy Policy" })}
                >
                    <Text style={styles.optionText}>Privacy Policy</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

function AccountScreenNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Account Overview" component={AccountScreen} options={{ headerShown: false }} />
            <Stack.Screen name="WebViewScreen" component={WebViewScreen} initialParams={{ type: WebViewTypes.Account }} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    optionText: {
        fontSize: 16,
        color: "#333",
    },
    switch: {
        marginRight: 8,
    }
});

export default AccountScreenNavigator;
