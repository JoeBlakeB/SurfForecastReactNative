/**
 * @fileoverview A single news item to be used within a news list on the news screen.
 */

import { Text, TouchableOpacity, Image, StyleSheet } from "react-native";

function NewsCard({ title, subtitle, image, onPress }) {
    return (
        <TouchableOpacity 
            style={styles.postCard}
            onPress={() => onPress()}
            delayPressIn={50}
            activeOpacity={0.9}
        >
            <Image style={styles.postImage} source={{ uri: image }} />
            <Text style={styles.postTitle}>{title}</Text>
            <Text style={styles.postSubtitle}>{subtitle}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    postCard: {
        marginBottom: 8,
        backgroundColor: "#fff",
        padding: 4,
    },
    postImage: {
        width: "100%",
        height: 180,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 6,
        marginHorizontal: 4,
    },
    postSubtitle: {
        fontSize: 14,
        color: "#666",
        marginHorizontal: 4,
        marginBottom: 4,
    },
});

export default NewsCard;
