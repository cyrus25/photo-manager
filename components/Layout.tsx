import { StyleSheet } from "react-native";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { SafeAreaView } from "react-native-safe-area-context";

const Layout = ({ children }) => {
  return (
    <SafeAreaView style={styles.rootContainer}>
      <Header />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootContainer: { flex: 1 },
});
