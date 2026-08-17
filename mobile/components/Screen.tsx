import { SafeAreaView } from "react-native-safe-area-context";
import { ViewProps } from "react-native";

type ScreenProps = ViewProps & {
  children: React.ReactNode;
};

export function Screen({ children, className = "", ...props }: ScreenProps) {
  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      className={`flex-1 bg-background-light dark:bg-background-dark ${className}`}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}
