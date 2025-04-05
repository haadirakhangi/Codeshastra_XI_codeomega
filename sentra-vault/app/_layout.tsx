// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack>
//       <Stack.Screen
//         name="index"
//         options={{
//           headerShown: false,
//         }}
//       />
//       <Stack.Screen
//         name="(auth)/login"
//         options={{
//           headerShown: false,
//         }}
//       />
//     </Stack>
//   );
// }

import { useEffect } from 'react';
import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { BottomTabBar } from '@react-navigation/bottom-tabs';

export default function RootLayout() {
  useFrameworkReady();


  return (
    <>
    <Slot screenOptions={{ headerShown: false }} />
      {/* <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack> */}
      <StatusBar style="auto" />
      
    </>
  );
}



