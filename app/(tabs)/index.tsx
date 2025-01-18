import {
  Image,
  StyleSheet,
  Platform,
  NativeModules,
  Button,
  FlatList,
  View,
  ImageSourcePropType,
} from "react-native";

import React, { useState } from "react";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import { window } from "@/constants/size";

export default function HomeScreen() {
  const { PhotoModule } = NativeModules;
  const [images, setImages] = useState(
    Array.from({ length: 30 }).map((_, i) => {
      return {
        id: i,
        image: `https://picsum.photos/1440/2842?random=${i}`,
        title: `This is the title! ${i + 1}`,
        subtitle: `This is the subtitle ${i + 1}!`,
      };
    })
  );

  const onPress = () => {
    PhotoModule.getPhotos(
      "testName",
      (error: any) => {
        console.log("error", error);
      },
      (data: any) => {
        console.log(typeof data);
        setImages(data);
      }
    );
  };

  const scrollOffsetValue = useSharedValue<number>(0);

  const headerHeight = 100;
  const PAGE_WIDTH = window.width;
  const PAGE_HEIGHT = window.height - headerHeight;

  const directionAnimVal = useSharedValue(0);

  const animationStyle = React.useCallback(
    (value: number) => {
      "worklet";
      const translateY = interpolate(value, [0, 1], [0, -18]);

      const translateX =
        interpolate(value, [-1, 0], [PAGE_WIDTH, 0], Extrapolation.CLAMP) *
        directionAnimVal.value;

      const rotateZ =
        interpolate(value, [-1, 0], [15, 0], Extrapolation.CLAMP) *
        directionAnimVal.value;

      const zIndex = interpolate(
        value,
        [0, 1, 2, 3, 4],
        [0, 1, 2, 3, 4].map((v) => (images.length - v) * 10),
        Extrapolation.CLAMP
      );

      const scale = interpolate(value, [0, 1], [1, 0.95]);

      const opacity = interpolate(
        value,
        [-1, -0.8, 0, 1],
        [0, 0.9, 1, 0.85],
        Extrapolation.EXTEND
      );

      return {
        transform: [
          { translateY },
          { translateX },
          { rotateZ: `${rotateZ}deg` },
          { scale },
        ],
        zIndex,
        opacity,
      };
    },
    [PAGE_HEIGHT, PAGE_WIDTH]
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        horizontal={true}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={images.slice(0, 20)}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                flex: 1,
                backgroundColor: "green",
                height: "90%",
                width: 500,
              }}
            >
              <Image
                key={item?.id}
                source={{ uri: item?.image }}
                style={{
                  ...StyleSheet.absoluteFillObject,
                }}
              />
            </View>
          );
        }}
        style={styles.list}
      />
      {/* <Button
        title='Click here'
        color='#841584'
        onPress={() => {
          console.log("helloo");
        }}
      />
      <Button
        title='Click to invoke your native module!'
        color='#841584'
        onPress={onPress}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { backgroundColor: "red" },
  // image: {
  //   height: 120,
  //   width: "33%",
  //   borderRadius: 4,
  //   marginRight: 4,
  //   marginBottom: 4,
  // },
});
