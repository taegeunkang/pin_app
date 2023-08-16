// import React from 'react';
// import {Text, TouchableOpacity} from 'react-native';
// import Home from '../screens/Home/Home';
// import MyPage from '../screens/Home/MyPage';
// import AlertScreen from '../screens/Home/AlertScreen';
// import Upload from '../screens/Home/Upload';
// import {createStackNavigator} from '@react-navigation/stack';
// import {WithLocalSvg} from 'react-native-svg';
// import RightArrow from '../theme/assets/images/arrow-right-solid.svg';
// import {useTranslation} from 'react-i18next';
// import Square from '../screens/Home/Square';
// import Square1 from '../screens/Home/Square1';
// import Detail from '../screens/Home/Detail';
// import MyList from '../screens/Home/MyList';
// import WriteContent from '../screens/Home/WriteContent';
// import FindingLocation from '../screens/Home/FindingLocation';

// const Stack = createStackNavigator();

// const HeaderRightButton = ({onPress}) => {
//   return (
//     <TouchableOpacity onPress={onPress}>
//       <WithLocalSvg asset={RightArrow} width={20} height={20} />
//     </TouchableOpacity>
//   );
// };
// // @refresh reset
// const Content = () => {
//   const {t} = useTranslation('newPost');
//   return (
//     <Stack.Navigator screenOptions={{headerShown: true}}>
//       <Stack.Screen
//         name="HomeScreen"
//         component={Home}
//         options={{
//           headerShown: false,
//         }}
//       />
//       <Stack.Screen
//         name="Upload"
//         component={Upload}
//         options={({navigation}) => ({
//           title: t('header.title'),
//           headerBackTitleVisible: false,
//           headerRight: () => (
//             <HeaderRightButton
//               onPress={() => navigation.navigate('WriteContent')}
//             />
//           ),
//         })}
//       />
//       <Stack.Screen
//         name="WriteContent"
//         component={WriteContent}
//         options={{title: t('header.title'), headerBackTitleVisible: false}}
//       />
//       <Stack.Screen
//         name="FindingLocation"
//         component={FindingLocation}
//         options={{title: t('header.location'), headerBackTitleVisible: false}}
//       />

//       {/* <Stack.Screen
//         name="Square"
//         component={Square}
//         options={{
//           headerBackTitleVisible: false,
//           headerTitle: t('header.title'),
//           // 버튼 이미지 삽입 예정
//           headerRight: () => (
//             <WithLocalSvg
//               width={23}
//               height={23}
//               asset={RightArrow}
//               onPress={() => alert('hi')}
//             />
//           ),
//         }}
//       /> */}

//       {/* <Stack.Screen
//         name="Square1"
//         component={Square1}
//         options={{
//           headerBackTitleVisible: false,
//           headerTitle: t('header.title'),
//           // 버튼 이미지 삽입 예정
//           headerRight: () => (
//             <WithLocalSvg
//               width={23}
//               height={23}
//               asset={RightArrow}
//               onPress={() => alert('hi')}
//             />
//           ),
//         }}
//       /> */}
//       {/* <Stack.Screen
//         name="Dummy"
//         component={Dummy}
//         // options={{
//         //   tabBarIconStyle: { display: 'none' },
//         //   tabBarLabelPosition: 'beside-icon',
//         // }}
//       /> */}
//       <Stack.Screen
//         name="AlertScreen"
//         component={AlertScreen}
//         // options={{
//         //   tabBarIconStyle: { display: 'none' },
//         //   tabBarLabelPosition: 'beside-icon',
//         // }}
//       />

//       <Stack.Screen
//         name="MyPage"
//         component={MyPage}
//         options={{
//           title: 'Mars2727',
//           headerBackTitleVisible: false,
//         }}
//       />
//       <Stack.Screen
//         name="Detail"
//         component={Detail}
//         options={{headerBackTitleVisible: false}}
//       />

//       <Stack.Screen
//         name="MyList"
//         component={MyList}
//         options={{headerBackTitleVisible: false}}
//       />
//     </Stack.Navigator>
//   );
// };
// export default Content;
