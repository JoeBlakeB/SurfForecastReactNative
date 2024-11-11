/**
 * @fileoverview This is a basic webview screen, which will display a page, after removing its header/footer
 */

import React, { useEffect, useState } from "react";
import { StyleSheet, View, Linking, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

/**
 * WebViewScreen component displays a web page in a WebView after modifying its content.
 */
function WebViewScreen({ route, navigation }) {
    const [htmlContent, setHtmlContent] = useState("");
    const [loading, setLoading] = useState(true);
    const url = route.params.url || null;
    const title = route.params.title || "Web Page";

    if (!url) {
        navigation.goBack();
        return null;
    }

    useEffect(() => {
        navigation.setOptions({ title: title });
        fetchHtmlContent(url);
    }, [navigation, url]);

    /**
     * Get and process the page to display to the user, removing its
     * header and footer, and script tags, and injecting some extra CSS.
     *
     * @param {string} url - The URL to fetch HTML content from.
     */
    const fetchHtmlContent = async (url) => {
        try {
            const response = await fetch(url);
            let text = await response.text();

            text = text
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
                .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
                .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
                .replace(/<div[^>]*(id="sl-header-ad")[^>]*>[\s\S]*?<\/div>/gi, "")
                .replace(/<button[^>]*(quiver-share-article__)[^>]*>[\s\S]*?<\/button>/gi, "");

            text = text.replace("</head>", `
                <style>
                    main { overflow-x:hidden; }
                    main>div>div { padding-top: 8px!important; }
                    table { display:block; overflow:scroll; }
                    .sl-editorial-author__container, .sl-editorial-article-bottom__social { display: none!important; }
                </style></head>`);

            setHtmlContent(text);
        } catch (error) {
            console.error("Error fetching content:", error);
            setHtmlContent(`<html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>body { justify-content: center; padding: 20px; }</style>
                </head>
                <body><div>
                    <h1>Oops!</h1>
                    <p>Something went wrong while fetching the content, please try again later.</p>
                </div></body>
            </html>`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Stops the WebView from opening links within itself, and will open them in an external browser instead.
     *
     * @param {Object} request - The request object with a url property.
     * @returns {boolean} True if the request should continue, or false if it has been opened externally.
     */
    const handleShouldStartLoadWithRequest = (request) => {
        const isExternalLink = request.url.startsWith("http://") || request.url.startsWith("https://");
        if (isExternalLink) {
            Linking.openURL(request.url);
            return false;
        }
        return true;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView 
                source={{ html: htmlContent }} 
                style={{ flex: 1 }} 
                onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});

export default WebViewScreen;
