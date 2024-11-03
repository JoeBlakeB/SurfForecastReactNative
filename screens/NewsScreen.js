/**
 * @fileoverview This is the news tab screen, for surflines news feed
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NewsScreen() {
  return (
    <View style={styles.container}>
      <Text>news</Text>
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
