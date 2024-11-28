/**
 * @fileoverview Converts the Surfline rating system to a 5 star rating
 * 
 * information about the surfline surf quality scale at
 * https://www.surfline.com/surf-news/surflines-rating-surf-heights-quality/1417
 * though the information may be outdated, their help screen of the app doesn't mention VERY_GOOD or GOOD_TO_EPIC
 */

import { View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

/**
 * @param {string} starCount how many stars to display
 */
const StarRating = ({ starCount, starSize=24 }) => {
    const fullStars = Math.floor(starCount);
    const halfStar = starCount % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const starStyle = [styles.star, {fontSize: starSize}];

    return (
        <View style={styles.container}>
            {[...Array(fullStars)].map((_, index) => (
                <FontAwesome key={`full-${index}`} name="star" style={starStyle} />
            ))}
            {halfStar && <FontAwesome name="star-half-o" style={starStyle} />}
            {[...Array(emptyStars)].map((_, index) => (
                <FontAwesome key={`empty-${index}`} name="star-o" style={starStyle} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginVertical: 8,
        flexDirection: "row",
    },
    star: {
        color: "#FFD700",
        marginHorizontal: 2,
    },
});

export default StarRating;
