import { StyleSheet, Text, View } from "react-native";
import React from "react";

type Props = {};

const Header = (props: Props) => {
  return (
    <View style={styles.pageHeaderContainer}>
      <Text>Header</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  pageHeaderContainer: {
    flexDirection: "row",
  },
});
