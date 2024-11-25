/**
 * @fileoverview This is the favorite locations tab screen, the home page, which shows the users saved locations
 */

import { StyleSheet, Text, View } from "react-native";

function SpotsScreen() {
    return (
        <View style={styles.container}>
            <Text>Spots</Text>
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

export default SpotsScreen;
