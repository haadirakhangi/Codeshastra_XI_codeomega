import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import "./global.css";
import { images } from "@/utils/constants/image";
import { useRouter } from "expo-router";
import CustomBackdrop from "@/components/backdrop";

export default function WelcomeScreen() {
  const router = useRouter();

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  return (
    <SafeAreaView className="flex-1  bg-white">
      <CustomBackdrop />

      <View className="flex-1 px-6 justify-center">
        <View className="items-center justify-center w-full mb-8">
          <Image
            source={images.welcomeImage}
            className="w-full aspect-square"
            style={{
              width: Math.min(windowWidth * 0.8, 380),
              height: Math.min(windowWidth * 0.9, 380),
              maxHeight: windowHeight * 0.4,
            }}
            resizeMode="cover"
          />
        </View>

        {/* Text content with exact font sizes and colors */}
        <View className="items-center mb-24 ">
          <Text className="text-4xl font-bold text-blue-700 text-center mb-6 leading-tight">
            SentraVault
          </Text>
          <Text className="text-base text-gray-800 text-center px-4 leading-relaxed">
          Unlock Enterprise Intelligence, Securely.
          </Text>
        </View>

        <View className="flex-row justify-between w-full px-2 sm:px-4 mb-10">
          <TouchableOpacity
            className="bg-blue-700 py-4 rounded-lg flex-1 mr-4 items-center justify-center"
            onPress={() =>
              router.push({
                pathname: "/login",
                params: {
                  role: "user",
                },
              })
            }
          >
            <Text className="text-white text-lg sm:text-xl font-semibold">
              User
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-transparent py-4 rounded-lg flex-1 items-center justify-center"
            onPress={() => {
              router.push({
                pathname: "/login",
                params: {
                  role: "admin",
                },
              });
            }}
          >
            <Text className="text-black text-lg sm:text-xl font-semibold">
             Admin
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      
    </SafeAreaView>
  );
}
