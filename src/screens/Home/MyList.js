import {View, StyleSheet, Text, Pressable, ScrollView} from 'react-native';
import {BorderRadius, Colors, FontSize} from '../../theme/Variables';
import {WithLocalSvg} from 'react-native-svg';
import UpBtn from '../../theme/assets/images/up-long-solid.svg';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import Detail from '../../screens/Home/Detail';
import ListContent from '../../components/Content/ListContent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';

const MyList = ({navigation}) => {
  const [posts, setPosts] = useState([]);

  const moveToDetail = contentId => {
    navigation.navigate('Detail', {id: contentId});
  };
  const load = async () => {
    const id = await AsyncStorage.getItem('id');
    const response = await fetch(API_URL + '/post/myListAll?id=' + id, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    });
    switch (response.status) {
      case 200:
        const res = await response.json();
        console.log(res);
        setPosts(res);
        break;
      case 400:
        break;
    }
  };

  useEffect(() => {
    load();
  }, []);
  return (
    <ScrollView
      style={[
        {width: '100%', height: '80%', backgroundColor: Colors.lightGray},
      ]}>
      {posts &&
        posts.map((post, index) => (
          <Pressable onPress={() => moveToDetail(post.contentId)}>
            <ListContent
              key={index}
              locationName={post.locationName}
              photos={post.photos}
              createdDate={post.date}
            />
          </Pressable>
        ))}
    </ScrollView>
  );
};

export default MyList;
