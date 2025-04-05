import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import {
  UserCircleIcon,
  Mail01Icon,
  PhoneOff01Icon,
  MapPinIcon,
  DocumentCodeIcon,
  UploadIcon,
  CheckListIcon,
  ArrowLeft01Icon,
  User02Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as DocumentPicker from "expo-document-picker";

// Define the form data structure for type safety
interface FormData {
  name: string;
  email: string;
  phone: string;
  fatherName: string;
  fatherMobile: string;
  motherName: string;
  motherMobile: string;
  address: string;
  aadhaarCard: DocumentPicker.DocumentPickerAsset | null;
}

// Define the errors structure
interface FormErrors {
  [key: string]: string | null;
}

const ProfileScreen: React.FC = () => {
  // State to manage all form fields with proper typing
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    fatherName: "",
    fatherMobile: "",
    motherName: "",
    motherMobile: "",
    address: "",
    aadhaarCard: null,
  });

  // State to track field validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Function to handle text input changes
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear errors when typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  // Function to handle document picking for Aadhaar card
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setFormData({
          ...formData,
          aadhaarCard: result.assets[0],
        });

        // Clear error if file is selected
        if (errors.aadhaarCard) {
          setErrors({
            ...errors,
            aadhaarCard: null,
          });
        }
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  // Function to save profile data
  const saveProfile = () => {
    // Basic validation
    const newErrors: FormErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.fatherName)
      newErrors.fatherName = "Father's name is required";
    if (!formData.fatherMobile)
      newErrors.fatherMobile = "Father's mobile is required";
    if (!formData.motherName)
      newErrors.motherName = "Mother's name is required";
    if (!formData.motherMobile)
      newErrors.motherMobile = "Mother's mobile is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.aadhaarCard)
      newErrors.aadhaarCard = "Aadhaar card PDF is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Handle form submission here
    console.log("Form data submitted:", formData);

    // You would typically send this data to your backend here
    alert("Profile saved successfully!");
  };

  // Render input field with icon and error handling
  const renderInputField = (
    field: keyof FormData,
    placeholder: string,
    value: string,
    icon: React.ReactNode,
    keyboardType: "default" | "email-address" | "phone-pad" = "default"
  ) => (
    <View className="mb-4">
      <View
        className={`flex-row items-center bg-gray-50 rounded-xl border ${
          errors[field] ? "border-red-500" : "border-gray-200"
        }`}
      >
        <View className="pl-4 pr-2">{icon}</View>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => handleChange(field, text)}
          keyboardType={keyboardType}
          className="flex-1 text-base py-3 pr-4"
        />
      </View>
      {errors[field] ? (
        <Text className="text-red-500 text-xs mt-1 ml-1">{errors[field]}</Text>
      ) : null}
    </View>
  );

  // Render section header
  const renderSectionHeader = (title: string, icon: React.ReactNode) => (
    <View className="flex-row items-center mb-4 mt-6">
      <View className="mr-2">{icon}</View>
      <Text className="text-xl font-bold text-gray-800">{title}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="p-6">
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <TouchableOpacity className="p-2">
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  size={24}
                  color="#0f172a"
                />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-gray-800 ml-2">
                Complete Your Profile
              </Text>
            </View>
            Profile Image
            <View className="items-center mb-8">
              <View className="relative">
                <View className="h-24 w-24 rounded-full bg-gray-200 items-center justify-center">
                  <HugeiconsIcon
                    icon={UserCircleIcon}
                    size={40}
                    color="#6b7280"
                  />
                </View>
                <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 border-2 border-white">
                  <HugeiconsIcon icon={UploadIcon} size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-gray-500 mt-2">
                Tap to upload profile picture
              </Text>
            </View>
            {/* Personal Information Section */}
            {renderSectionHeader(
              "Personal Information",
              <HugeiconsIcon icon={UserCircleIcon} size={24} color="#1d4ed8" />
            )}
            <View className="mb-6">
              {renderInputField(
                "name",
                "Full Name",
                formData.name,
                <HugeiconsIcon
                  icon={UserCircleIcon}
                  size={20}
                  color="#6b7280"
                />
              )}
              {renderInputField(
                "email",
                "Email Address",
                formData.email,
                <HugeiconsIcon icon={Mail01Icon} size={20} color="#6b7280" />,
                "email-address"
              )}
              {renderInputField(
                "phone",
                "Phone Number",
                formData.phone,
                <HugeiconsIcon
                  icon={PhoneOff01Icon}
                  size={20}
                  color="#6b7280"
                />,
                "phone-pad"
              )}
            </View>
            {/* Parents Details Section */}
            {renderSectionHeader(
              "Parents Details",
              <HugeiconsIcon icon={User02Icon} size={24} color="#1d4ed8" />
            )}
            <View className="mb-6">
              <Text className="font-medium text-gray-700 mb-3">
                Father's Information
              </Text>
              {renderInputField(
                "fatherName",
                "Father's Name",
                formData.fatherName,
                <HugeiconsIcon
                  icon={UserCircleIcon}
                  size={20}
                  color="#6b7280"
                />
              )}
              {renderInputField(
                "fatherMobile",
                "Father's Mobile",
                formData.fatherMobile,
                <HugeiconsIcon
                  icon={PhoneOff01Icon}
                  size={20}
                  color="#6b7280"
                />,
                "phone-pad"
              )}

              <Text className="font-medium text-gray-700 mb-3 mt-4">
                Mother's Information
              </Text>
              {renderInputField(
                "motherName",
                "Mother's Name",
                formData.motherName,
                <HugeiconsIcon
                  icon={UserCircleIcon}
                  size={20}
                  color="#6b7280"
                />
              )}
              {renderInputField(
                "motherMobile",
                "Mother's Mobile",
                formData.motherMobile,
                <HugeiconsIcon
                  icon={PhoneOff01Icon}
                  size={20}
                  color="#6b7280"
                />,
                "phone-pad"
              )}
            </View>
            {/* Address Section */}
            {renderSectionHeader(
              "Address Details",
              <HugeiconsIcon icon={Home01Icon} size={24} color="#1d4ed8" />
            )}
            <View className="mb-6">
              <View className="mb-4">
                <View
                  className={`bg-gray-50 rounded-xl border ${
                    errors.address ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <View className="flex-row items-start p-4">
                    <HugeiconsIcon
                      icon={MapPinIcon}
                      size={20}
                      color="#6b7280"
                    />
                    <TextInput
                      placeholder="Full Address"
                      value={formData.address}
                      onChangeText={(text) => handleChange("address", text)}
                      multiline
                      numberOfLines={4}
                      className="flex-1 text-base ml-2"
                      textAlignVertical="top"
                    />
                  </View>
                </View>
                {errors.address ? (
                  <Text className="text-red-500 text-xs mt-1 ml-1">
                    {errors.address}
                  </Text>
                ) : null}
              </View>
            </View>
            {/* Documents Section */}
            {renderSectionHeader(
              "Documents",
              <HugeiconsIcon
                icon={DocumentCodeIcon}
                size={24}
                color="#1d4ed8"
              />
            )}
            <View className="mb-6">
              <Text className="font-medium text-gray-700 mb-3">
                Aadhaar Card (PDF)
              </Text>

              <TouchableOpacity
                onPress={pickDocument}
                className={`border-2 border-dashed rounded-xl p-6 items-center justify-center bg-gray-50 ${
                  errors.aadhaarCard ? "border-red-300" : "border-gray-300"
                }`}
              >
                {formData.aadhaarCard ? (
                  <View className="items-center">
                    <View className="bg-green-100 rounded-full p-3 mb-2">
                      <HugeiconsIcon
                        icon={CheckListIcon}
                        size={24}
                        color="#16a34a"
                      />
                    </View>
                    <Text className="text-green-700 font-medium">
                      {formData.aadhaarCard.name}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      Tap to change file
                    </Text>
                  </View>
                ) : (
                  <View className="items-center">
                    <HugeiconsIcon
                      icon={UploadIcon}
                      size={32}
                      color="#6b7280"
                    />
                    <Text className="text-gray-600 font-medium mt-2">
                      Upload Aadhaar Card PDF
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      Tap to browse files
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {errors.aadhaarCard ? (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.aadhaarCard}
                </Text>
              ) : null}
            </View>
            {/* Save Button */}
            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-xl mt-4"
              onPress={saveProfile}
            >
              <Text className="text-white text-center font-bold text-lg">
                Save Profile
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
