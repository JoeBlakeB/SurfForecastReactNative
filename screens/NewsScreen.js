/**
 * @fileoverview This is the news tab screen, for surflines news feed
 */

import React from "react";
import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView  } from "react-native-safe-area-context";
import useNewsAPI from "../components/NewsAPI";
import NewsCard from "../components/NewsCard";

function NewsScreen() {
    const { posts, isLoading, loadMorePosts } = useNewsAPI();

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <NewsCard title={item.title} subtitle={item.subtitle} image={item.media.feed1x} permalink={item.permalink} />
                )}
                onEndReached={loadMorePosts}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isLoading && <ActivityIndicator size="large" color="#0000ff" />}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default NewsScreen;
