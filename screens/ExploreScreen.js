/**
 * @fileoverview This is the explore tab screen, with a map for discovering new places to go
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";

function ExploreScreen() {
    return (
        <View style={styles.container}>
            <Text>explore</Text>
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

export default ExploreScreen;
