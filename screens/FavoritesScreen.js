/**
 * @fileoverview This is the favorite locations tab screen, the home page, which shows the users saved locations
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";

function FavoritesScreen() {
    return (
        <View style={styles.container}>
            <Text>favorites</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default FavoritesScreen;
