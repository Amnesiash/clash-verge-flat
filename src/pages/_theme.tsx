import getSystem from "@/utils/get-system";
const OS = getSystem();

// default theme setting
export const defaultTheme = {
  primary_color: "#007AFF",
  secondary_color: "#FFCC00",
  primary_text: "#000000",
  secondary_text: "#3c3c4399",
  info_color: "#007AFF",
  error_color: "#FF3B30",
  warning_color: "#FF9500",
  success_color: "#06943D",
  background_color: "transparent",
  font_family: `-apple-system, BlinkMacSystemFont,"Microsoft YaHei UI", "Microsoft YaHei", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", ${
    OS === "windows" ? "twemoji mozilla" : ""
  }`,
};

// dark mode
export const defaultDarkTheme = {
  ...defaultTheme,
  primary_color: "#0A84FF",
  secondary_color: "#FF9F0A",
  primary_text: "#ffffff",
  background_color: "transparent",
  secondary_text: "#ebebf599",
  info_color: "#0A84FF",
  error_color: "#FF453A",
  warning_color: "#FF9F0A",
  success_color: "#30D158",
};
