/**
 * @fileoverview This is the news tab screen, for surflines news feed
 */

import React from "react";
import { StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import WebViewScreen, {WebViewTypes} from "./WebViewScreen";
import useNewsAPI from "../components/data/NewsAPI";
import NewsCard from "../components/NewsCard";

const Stack = createStackNavigator();

function NewsScreen({ navigation }) {
    const { posts, isLoading, loadMorePosts } = useNewsAPI();

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <NewsCard 
                        title={item.title}
                        subtitle={item.subtitle}
                        image={item.media.feed1x}
                        onPress={() => navigation.navigate("WebViewScreen", { url: item.permalink, title: item.title })}
                    />
                )}
                onEndReached={loadMorePosts}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isLoading && <ActivityIndicator size="large" color="#0000ff" />}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

function NewsScreenNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="NewsFeed" component={NewsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="WebViewScreen" component={WebViewScreen} initialParams={{ type: WebViewTypes.News }} />
        </Stack.Navigator>
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

export default NewsScreenNavigator;
