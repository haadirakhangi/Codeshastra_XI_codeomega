import { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, TextInput, Button } from 'react-native';

const announcements = [
  { id: 1, title: 'Guest Lecture Tomorrow' },
  { id: 2, title: 'Internal Exam Timetable Released' },
  { id: 3, title: 'Hackathon Registration Open' },
  { id: 4, title: 'Workshop on AI this Friday' },
];

const laundries = [
  {
    id: 1,
    name: 'Data Structures Class',
    rating: 4.8,
    reviews: 485,
    time: '9:00 AM - 10:00 AM',
    distance: 'Room 301',
    image: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=500',
  },
  {
    id: 2,
    name: 'AI Seminar',
    rating: 4.9,
    reviews: 500,
    time: '12:00 PM - 2:00 PM',
    distance: 'Auditorium',
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=500',
  },
  {
    id: 3,
    name: 'Web Dev Practical',
    rating: 4.7,
    reviews: 390,
    time: '3:00 PM - 5:00 PM',
    distance: 'Lab 2',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=500',
  },
];

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const handleSubmit = () => {
    console.log('Attendance marked:', inputText);
    setModalVisible(false);
    setInputText('');
  };

  return (
    <ScrollView className="flex-1 bg-[#FDFDFD]">
      <View className="p-4 pt-12">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-[#162C88]">Hello,</Text>
            <Text className="text-xl font-bold text-[#162C88]">Tannish</Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' }}
            className="w-10 h-10 rounded-full"
          />
        </View>

        {/* Promo Banner */}
        <View className="bg-[#FDF5F2] p-4 rounded-xl mb-6 border border-[#FCE5D6]">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-bold text-[#162C88] mb-1">Attendance</Text>
              <Text className="text-[#555] mb-3">Click to Enter Code</Text>
              <TouchableOpacity
                className="bg-[#F47C26] py-2 px-5 rounded-full self-start shadow-sm active:opacity-80"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-white font-semibold text-base tracking-wide">✨ Mark Attendance</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/256/4440/4440953.png' }}
              className="w-24 h-24"
            />
          </View>
        </View>

        {/* Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50 px-4">
            <View className="bg-white rounded-xl p-6 w-full max-w-md">
              <Text className="text-lg font-bold text-[#162C88] mb-2">Enter Your Code</Text>
              <TextInput
                placeholder="Type here..."
                value={inputText}
                onChangeText={setInputText}
                className="border border-gray-300 rounded-md p-2 mb-4"
              />
              <Button color="#F47C26" title="Submit" onPress={handleSubmit} />
            </View>
          </View>
        </Modal>

        {/* Announcements */}
        <Text className="text-lg font-bold mb-4 text-[#162C88]">Recent Announcements</Text>
        <View className="flex-row justify-between mb-6 flex-wrap">
          {announcements.map((item) => (
            <View
              key={item.id}
              className="bg-white border border-[#F1DCDC] p-4 rounded-xl mb-3 w-[48%] shadow-sm"
            >
              <Text className="text-sm font-medium text-[#162C88]">{item.title}</Text>
            </View>
          ))}
        </View>

        {/* Today's Schedule */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-[#162C88]">Today’s Schedule</Text>
            <TouchableOpacity>
              <Text className="text-[#F47C26]">See all</Text>
            </TouchableOpacity>
          </View>

          {laundries.map((laundry) => (
            <TouchableOpacity
              key={laundry.id}
              className="bg-white p-3 rounded-xl mb-3 flex-row items-center border border-[#EEEEEE] shadow-sm"
            >
              <Image
                source={{ uri: laundry.image }}
                className="w-16 h-16 rounded-xl mr-3"
              />
              <View className="flex-1">
                <Text className="font-medium text-base mb-1 text-[#162C88]">{laundry.name}</Text>
                <View className="flex-row items-center mb-1">
                  {'★★★★★'.split('').map((star, index) => (
                    <Text
                      key={index}
                      className={index < Math.floor(laundry.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                      {star}
                    </Text>
                  ))}
                  <Text className="text-gray-500 ml-1">({laundry.reviews})</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-gray-500 text-sm">{laundry.time}</Text>
                  <Text className="text-gray-500 text-sm ml-4">{laundry.distance}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
