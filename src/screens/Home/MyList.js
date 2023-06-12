import {View, StyleSheet, Text, Pressable, ScrollView} from 'react-native';
import {BorderRadius, Colors, FontSize} from '../../theme/Variables';
import {WithLocalSvg} from 'react-native-svg';
import UpBtn from '../../theme/assets/images/up-long-solid.svg';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import Detail from '../../screens/Home/Detail';
import ListContent from '../../components/Content/ListContent';

const MyList = ({navigation}) => {
  const moveToDetail = () => {
    // console.log('??');
    // setListBtn(false);
    navigation.navigate('Detail');
  };
  return (
    <ScrollView
      style={[
        {width: '100%', height: '80%', backgroundColor: Colors.lightGray},
      ]}>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
      <Pressable onPress={moveToDetail}>
        <ListContent />
      </Pressable>
    </ScrollView>
  );
};

export default MyList;
