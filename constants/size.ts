import { Dimensions, Platform, ScaledSize } from "react-native";

const isWeb = Platform.OS === "web";

export const MAX_WIDTH = 430;

export const window: ScaledSize = isWeb
  ? { width: MAX_WIDTH, height: 800, scale: 1, fontScale: 1 }
  : Dimensions.get("screen");
