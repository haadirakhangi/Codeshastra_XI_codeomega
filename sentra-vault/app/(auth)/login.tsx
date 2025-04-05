import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  StatusBar,
} from "react-native";
import CustomBackdrop from "@/components/backdrop";
import { images } from "@/utils/constants/image";
import Helper from "@/utils/helpers/helper";
import { signIn } from "@/services/api";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { LockPasswordIcon, UserIcon } from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateUsername = (text: string) => {
    setUsername(text);

    if (!text) {
      setUsernameError("Username is required");
    } else if (!Helper.usernameRegex.test(text)) {
      setUsernameError("Please enter a valid username");
    } else {
      setUsernameError("");
    }
  };

  // Validate password
  const validatePassword = (text: string) => {
    setPassword(text);

    if (!text) {
      setPasswordError("Password is required");
    } else if (text.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  useEffect(() => {
    if (username && password && !usernameError && !passwordError) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [username, password, usernameError, passwordError]);

  const handleLogin = async () => {
    if (!username) setUsernameError("Username is required");
    if (!password) setPasswordError("Password is required");

    if (isFormValid) {
      try {
        // router.push("/home");
        router.replace("/home");
        // const result = await signIn(username, password);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View className="flex-1 bg-white relative">
      <StatusBar barStyle="dark-content" />

      {/* Add the backdrop */}
      <CustomBackdrop />

      <SafeAreaView className="flex-1 bg-transparent">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            className="flex-1"
          >
            <View className="flex-1 px-6 pt-10 pb-6 justify-center">
              {/* Top section with logo and welcome text */}
              <View className="items-center mt-10 mb-10">
                <Image
                  source={images.icon}
                  className="h-20 w-30"
                  resizeMode="contain"
                />
                <Text className="mt-4 text-xl font-semibold text-center text-black">
                  Welcome back you've been missed!
                </Text>
                <Text className="mt-2 text-lg text-center text-black">
                  Sign in to continue
                </Text>
              </View>

              <View className="mb-4">
                <View
                  className={`flex-row items-center bg-blue-50 rounded-lg border ${
                    usernameError ? "border-red-500" : "border-blue-100"
                  }`}
                >
                  <View className="pl-4 pr-2">
                    <HugeiconsIcon icon={UserIcon} />
                  </View>
                  <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={validateUsername}
                    autoCapitalize="none"
                    className="flex-1 text-lg py-4 pr-6"
                  />
                </View>
                {usernameError ? (
                  <Text className="text-red-500 text-sm mt-1 ml-1">
                    {usernameError}
                  </Text>
                ) : null}
              </View>

              {/* Password input */}
              <View className="mb-2">
                <View
                  className={`flex-row items-center bg-blue-50 rounded-lg border ${
                    passwordError ? "border-red-500" : "border-blue-100"
                  }`}
                >
                  <View className="pl-4 pr-2">
                    <HugeiconsIcon icon={LockPasswordIcon} />
                  </View>
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={validatePassword}
                    secureTextEntry
                    className="flex-1 text-lg py-4 pr-6"
                  />
                </View>
                {passwordError ? (
                  <Text className="text-red-500 text-sm mt-1 ml-1">
                    {passwordError}
                  </Text>
                ) : null}
              </View>

              {/* Forgot password link */}
              <TouchableOpacity className="self-end mb-6">
                <Text className="text-blue-700 font-semibold text-base">
                  Forgot your password?
                </Text>
              </TouchableOpacity>

              {/* Sign in button */}
              <TouchableOpacity
                className={`rounded-lg py-4 flex-row justify-center items-center bg-blue-700`}
                onPress={handleLogin}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" className="mr-2" />
                ) : null}
                <Text className="text-white text-xl font-semibold text-center">
                  {isLoading ? "Signing in..." : "Sign in"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default LoginScreen;
