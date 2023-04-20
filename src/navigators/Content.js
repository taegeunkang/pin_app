import React from 'react';
import Home from '../screens/Home/Home';
import MyPage from '../screens/Home/MyPage';
import AlertScreen from '../screens/Home/AlertScreen';
import Upload from '../screens/Home/Upload';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
// @refresh reset
const Content = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        // options={{
        //   tabBarIconStyle: { display: 'none' },
        //   tabBarLabelPosition: 'beside-icon',
        //   tabBarShowLabel: false,
        // }}
      />
      <Stack.Screen
        name="Upload"
        component={Upload}
        // options={{
        //   tabBarIconStyle: { display: 'none' },
        //   tabBarLabelPosition: 'beside-icon',
        // }}
      />
      {/* <Stack.Screen
        name="Dummy"
        component={Dummy}
        // options={{
        //   tabBarIconStyle: { display: 'none' },
        //   tabBarLabelPosition: 'beside-icon',
        // }}
      /> */}
      <Stack.Screen
        name="AlertScreen"
        component={AlertScreen}
        // options={{
        //   tabBarIconStyle: { display: 'none' },
        //   tabBarLabelPosition: 'beside-icon',
        // }}
      />

      <Stack.Screen
        name="MyPage"
        component={MyPage}
        // options={{
        //   tabBarIconStyle: { display: 'none' },
        //   tabBarLabelPosition: 'beside-icon',
        // }}
      />
    </Stack.Navigator>
  );
};
export default Content;
