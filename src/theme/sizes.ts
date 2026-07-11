// theme/sizes.ts
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const sizes = {
    width,
    height,
    isSmallDevice: width < 375,
    headerHeight: 64,
    tabBarHeight: 60,
};

export default sizes;