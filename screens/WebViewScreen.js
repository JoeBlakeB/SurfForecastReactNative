/**
 * @fileoverview This is a basic webview screen, which will display a page, after removing its header/footer
 */

import { useEffect, useState } from "react";
import { StyleSheet, View, Linking, ActivityIndicator, TouchableOpacity, Share } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

export const WebViewTypes = Object.freeze({ News: 1, Account: 2 });

const MAX_RETRY_COUNT = 3;
const SURFLINE_NEWS = "Surfline News";

/**
 * WebViewScreen component which displays a web page in a WebView after modifying its content.
 * 
 * @return {React.ReactElement}
 */
function WebViewScreen({ route, navigation }) {
    const [htmlContent, setHtmlContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState(route.params.url || null);
    const [title, setTitle] = useState(route.params.title || "Web Page");

    if (!url) {
        navigation.goBack();
        return null;
    }

    const shareContent = async () => {
        try {
            await Share.share({
                message: `${title}: ${url}`,
                url: url,
                title: title,
            });
        } catch (error) {
            console.error("Error sharing content:", error);
        }
    };

    useEffect(() => {
        navigation.setOptions({ 
            title: route.params.type === WebViewTypes.News ? SURFLINE_NEWS : title,
            headerRight: () => (
                <TouchableOpacity onPress={shareContent} style={styles.shareButton}>
                    <Ionicons name="share-social" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
        fetchHtmlContent(url);
    }, [navigation, url]);

    const showErrorHtml = (message) => {
        setHtmlContent(`<html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>body { justify-content: center; padding: 20px; }</style>
            </head>
            <body><div>
                <h1>Oops!</h1>
                <p>${message}</p>
            </div></body>
        </html>`);
    };

    /**
     * Get and process the page to display to the user, removing its
     * header and footer, and script tags, and injecting some extra CSS.
     *
     * @param {string} url - The URL to fetch HTML content from.
     */
    const fetchHtmlContent = async (url) => {
        try {
            setLoading(true);
            let response;
            for (let i = 0; i < MAX_RETRY_COUNT; i++) {
                response = await fetch(url);

                if (response.status != 429)
                    break;
                else {
                    console.warn("Too many requests, retrying in 5 seconds...");
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }

            if (response.status == 429) {
                console.error("Too many requests, aborting...");
                showErrorHtml("Too many requests, please try again later.");
                return;
            }

            let text = await response.text();

            const titleMatch = text.match(/<title>(.*?)<\/title>/i);
            let currentTitle = title;
            if (titleMatch && titleMatch[1]) {
                currentTitle = titleMatch[1]
                setTitle(currentTitle);
            }
            navigation.setOptions({ title: route.params.type === WebViewTypes.News ? SURFLINE_NEWS : currentTitle })

            text = text
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
                .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
                .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
                .replace(/<div[^>]*(id="sl-header-ad")[^>]*>[\s\S]*?<\/div>/gi, "")
                .replace(/<button[^>]*(quiver-share-article__)[^>]*>[\s\S]*?<\/button>/gi, "")
                .replace(/<noscript[^>]*>([\s\S]*?)<\/noscript>/gi, "<div>$1</div>");

            text = text.replace("</head>", `
                <style>
                    main { overflow-x:hidden; }
                    main>div>div { padding-top: 8px!important; }
                    table { display:block; overflow:scroll; }
                    .sl-editorial-author__social, .sl-editorial-article-bottom__social { display: none!important; }
                </style></head>`);

            setHtmlContent(text);
        } catch (error) {
            console.error("Error fetching content:", error);
            showErrorHtml("Something went wrong while fetching the content, please try again later.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Stops the WebView from opening links within itself, they will either be opened in an external browser instead,
     * or will be opened by navigating to the correct tabs WebViewScreen.
     * This also forces opening a new article from another to render it in the same way as first opening an article.
     *
     * @param {Object} request - The request object with a url property.
     * @returns {boolean} True if the request should continue, or false if it has been opened externally.
     */
    const handleShouldStartLoadWithRequest = (request) => {
        const requestUrl = request.url;
        const isExternalLink = requestUrl.startsWith("http://") || requestUrl.startsWith("https://");
        if (!isExternalLink)
            return true;
        
        const newsURLRegex = /^https:\/\/www\.surfline\.com\/surf-news\/[a-zA-Z0-9-]+\/\d+$/;
        
        if (newsURLRegex.test(requestUrl)) {
            if (route.params.type === WebViewTypes.News) {
                setUrl(requestUrl)
            } else {
                navigation.navigate("News");
                navigation.navigate("News", { screen: "WebViewScreen", params: { url: requestUrl } });
            }
            return false;
        }
        
        const accountURLRegex = /^https:\/\/www\.surfline\.com\/(terms-of-use|privacy-policy)/;
        
        if (accountURLRegex.test(requestUrl)) {
            if (route.params.type === WebViewTypes.Account) {
                setUrl(requestUrl)
            } else {
                navigation.navigate("Account");
                navigation.navigate("Account", { screen: "WebViewScreen", params: { url: requestUrl } });
            }
            return false;
        }
        
        Linking.openURL(requestUrl);
        return false;
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
    shareButton: {
        marginRight: 12,
    }
});

export default WebViewScreen;
