import React from 'react';
import Home from '../screens/Home/Home';
import MyPage from '../screens/Home/MyPage';
import AlertScreen from '../screens/Home/AlertScreen';
import Upload from '../screens/Home/Upload';
import { createStackNavigator } from '@react-navigation/stack';
import { WithLocalSvg } from 'react-native-svg';
import RightArrow from "../theme/assets/images/arrow-right-solid.svg";
import {Button} from "react-native";
const Stack = createStackNavigator();
// @refresh reset
const Content = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        options={{
          headerShown : false
        }}
      />
      <Stack.Screen
        name="Upload"
        component={Upload}
        options={{
          headerBackTitleVisible : false,
          // 버튼 이미지 삽입 예정 
          headerRight: () => (
            <WithLocalSvg width={23} height={23} asset={RightArrow} onPress={() => alert("hi")}/>)
        }}
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
        options={{
          headerBackTitleVisible : false
        }}
      />
    </Stack.Navigator>
  );
};
export default Content;
