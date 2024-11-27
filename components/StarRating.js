/**
 * @fileoverview Converts the Surfline rating system to a 5 star rating
 * 
 * information about the surfline surf quality scale at
 * https://www.surfline.com/surf-news/surflines-rating-surf-heights-quality/1417
 * though the information may be outdated, their help screen of the app doesn't mention VERY_GOOD or GOOD_TO_EPIC
 */

import { View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const RATINGS = {
    FLAT: 0,
    VERY_POOR: 0.5,
    POOR: 1,
    POOR_TO_FAIR: 2,
    FAIR: 3,
    FAIR_TO_GOOD: 3.5,
    GOOD: 4,
    VERY_GOOD: 4.5,
    GOOD_TO_EPIC: 4.5,
    EPIC: 5,
};

/**
 * @param {string} waveRating the surfline rating
 */
const StarRating = ({ waveRating, starSize=24 }) => {
    const stars = RATINGS[waveRating] || 0;

    const fullStars = Math.floor(stars);
    const halfStar = stars % 1 >= 0.5;
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
        marginVertical: 10,
        flexDirection: "row",
    },
    star: {
        color: "#FFD700",
        marginHorizontal: 2,
    },
});

export default StarRating;
