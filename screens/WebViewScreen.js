/**
 * @fileoverview This is a basic webview screen, which will just display a url
 */

import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

function WebViewScreen({ route, navigation }) {
    const url = route.params.url || null;

    if (!route.params.url) {
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <WebView source={{ uri: url }} style={{ flex: 1 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});

export default WebViewScreen;
