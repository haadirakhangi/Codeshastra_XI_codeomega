// import { Tabs } from 'expo-router';
// import { Home, Calendar, Bell, User } from 'lucide-react-native';

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           backgroundColor: 'white',
//           borderTopWidth: 1,
//           borderTopColor: '#e5e7eb',
//           height: 60,
//           paddingBottom: 8,
//           paddingTop: 8,
//         },
//         tabBarActiveTintColor: '#3498db',
//         tabBarInactiveTintColor: '#9ca3af',
//       }}>
//       <Tabs.Screen
//         name="home"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
//         }}
//       />
//       {/* <Tabs.Screen
//         name="orders"
//         options={{
//           title: 'Orders',
//           tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="notifications"
//         options={{
//           title: 'Notifications',
//           tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
//         }}
//       /> */}
//     </Tabs>
//   );
// }

import { Tabs } from 'expo-router';
import {  Home, Calendar, Bell, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60,
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatBot"
        options={{
          title: 'Chat Bot',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
