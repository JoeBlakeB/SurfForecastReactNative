/**
 * @fileoverview The API access for the news feed
 */

import { useContext, useState, useEffect } from "react";
import SettingsContext from "./SettingsContext";

const POSTS_PER_REQUEST = 8;

const DEMO_POSTS = [
    {
        id: "demo1",
        title: "In Their Words",
        subtitle: "Four LGBTQ+ waveriders share their journeys in the surf world",
        permalink: "https://www.surfline.com/surf-news/in-their-words/123941",
        media: {
            type: "image",
            feed1x: "https://d14fqx6aetz9ka.cloudfront.net/wp-content/uploads/2021/06/24141036/makoa-Heiko-Bothe3-copy.jpg"
        }
    },
    {
        id: "demo2",
        title: "\"Wake Up Fellas, It's 1991.\"",
        subtitle: "“Girls Can’t Surf”, may be the year’s best surf documentary.",
        permalink: "https://www.surfline.com/surf-news/wake-fellas-1991/113406",
        media: {
            type: "image",
            feed1x: "https://d14fqx6aetz9ka.cloudfront.net/wp-content/uploads/2021/02/08193121/Hero-girls-cant-surf.jpg"
        }
    },
    {
        id: "demo3",
        title: "Keala Kennelly: \"Dream the Big, Crazy Dream\"",
        subtitle: "Newly minted Big Wave champ Keala Kennelly offers up inspiring words of wisdom",
        permalink: "https://www.surfline.com/surf-news/keala-kennelly-dream-big-crazy-dream/48336",
        media: {
            type: "image",
            feed1x: "https://d14fqx6aetz9ka.cloudfront.net/wp-content/uploads/2019/03/31172733/BWT_Keala9922WSLawards19cestari-new-e1554078504278.jpg"
        }
    }
]

const useNewsAPI = () => {
    const { settings } = useContext(SettingsContext);
    const [posts, setPosts] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [isMoreAvailable, setIsMoreAvailable] = useState(true);

    const fetchPosts = async () => {
        if (isLoading || !isMoreAvailable) return;

        setLoading(true);
        try {
            let postsData
            if (settings.useRealAPI) {
                const response = await fetch(
                    `https://www.surfline.com/wp-json/sl/v1/taxonomy/posts/category?limit=${POSTS_PER_REQUEST}&offset=${offset}&geotarget=EU`
                );
                postsData = (await response.json()).posts;
            } else {
                postsData = DEMO_POSTS.slice(offset, offset + POSTS_PER_REQUEST);
            }
            
            setPosts(prevPosts => [...prevPosts, ...postsData]);
            setOffset(prevOffset => prevOffset + POSTS_PER_REQUEST);
            setIsMoreAvailable(postsData.length === POSTS_PER_REQUEST);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMorePosts = () => {
        if (!isLoading && isMoreAvailable) {
            fetchPosts();
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return { posts, isLoading, loadMorePosts };
};

export default useNewsAPI;
