import { useLoading } from "@/contexts/LoadingContext";
import { ActivityIndicator, View } from "react-native";

export default function LoadingLayout() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <View
      style={{
        position        : "absolute",
        top             : 0,
        left            : 0,
        right           : 0,
        bottom          : 0,
        backgroundColor : "rgba(0,0,0,0.3)",
        justifyContent  : "center",
        alignItems      : "center",
        zIndex          : 1000,
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}