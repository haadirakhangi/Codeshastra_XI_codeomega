import React from "react";
import { View } from "react-native";

const FilledCircle = ({ color, style }: any) => {
  return (
    <View
      style={[
        {
          position: "absolute",
          backgroundColor: color,
          borderRadius: 9999,
        },
        style,
      ]}
    />
  );
};

const ShallowCircle = ({
  borderColor,
  backgroundColor = "transparent",
  borderRadius = 9999,
  style,
}: any) => {
  return (
    <View
      style={[
        {
          position: "absolute",
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          borderWidth: 1,
          borderRadius: borderRadius,
        },
        style,
      ]}
    />
  );
};

const CustomBackdrop = () => {
  // Primary color with 10% opacity
  const primaryColorLight = "rgba(59, 130, 246, 0.1)"; // blue-500 with 0.1 opacity

  return (
    <View className="absolute inset-0 -z-10" style={{ pointerEvents: "none" }}>
      {/* Top right filled circle */}
      <FilledCircle
        color={primaryColorLight}
        style={{
          top: -380,
          right: -380,
          height: 635,
          width: 635,
        }}
      />

      {/* Top right shallow circle */}
      <ShallowCircle
        borderColor={primaryColorLight}
        style={{
          top: -202,
          right: -180,
          height: 496,
          width: 496,
        }}
      />

      {/* Bottom left shallow circle */}
      <ShallowCircle
        borderColor={primaryColorLight}
        borderRadius={0}
        style={{
          bottom: -240,
          left: -395,
          height: 500,
          width: 500,
        }}
      />

      {/* Bottom left rotated shallow circle */}
      <View
        style={{
          position: "absolute",
          bottom: -200,
          left: -400,
          height: 500,
          width: 500,
          transform: [{ rotate: "30deg" }],
        }}
      >
        <ShallowCircle
          borderColor={primaryColorLight}
          borderRadius={0}
          style={{
            height: "100%",
            width: "100%",
            position: "relative",
          }}
        />
      </View>
    </View>
  );
};

export default CustomBackdrop;
