/**
 * @fileoverview This is the account management tab screen, which shows the users account options
 */

import React, { useState } from "react";
import { StyleSheet, Text, View, Switch, TouchableOpacity } from "react-native";

function AccountScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
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
        </View>
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    optionText: {
        fontSize: 16,
        color: "#333",
    },
});

export default AccountScreen;
