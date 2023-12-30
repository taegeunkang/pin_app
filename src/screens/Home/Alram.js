import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useLayoutEffect, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {useTheme} from '../../hooks';
import {API_URL} from '../../utils/constants';
import {reIssue} from '../../utils/login';
import {timeAgo} from '../../utils/util';
const Alram = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.push('Setting');
          }}>
          <Image
            source={Images.detail}
            style={{
              width: responsiveWidth(20),
              height: responsiveHeight(20),
              marginRight: responsiveWidth(10),
            }}
          />
        </TouchableOpacity>
      ),
    });
  });
  const {Images, Colors, Fonts} = useTheme();
  const [notification, setNotification] = useState([]);
  const [myId, setMyId] = useState(null);
  const load = async () => {
    setMyId(await AsyncStorage.getItem('id'));

    const response = await fetch(API_URL + '/post/alram', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    });
    switch (response.status) {
      case 200:
        let r1 = await response.json();
        console.log(r1);
        setNotification(r1);
        break;
      case 400:
        let r = await response.json();
        switch (r.code) {
          case 'U08':
            await reIssue();
            await load();
            break;
        }
    }
  };

  const moveToDetail = async (postId, content) => {
    fetch(API_URL + `/post/alram/read?postId=${postId}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
    });
    navigation.push('AlramDetail', {
      ...content,
      before: 'Alram',
    });
  };
  useEffect(() => {
    load();
  }, []);

  return (
    <View>
      {notification.length > 0 && (
        <ScrollView>
          {notification.map((noti, index) => (
            <Notify
              message={noti.message}
              createdDate={noti.createdDate}
              onPress={() => moveToDetail(noti.detail.postId, noti.detail)}
            />
          ))}
        </ScrollView>
      )}
      {notification.length == 0 && (
        <View
          style={{
            backgroundColor: Colors.contentBackground,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={[Fonts.contentMediumMedium, {color: Colors.textBold}]}>
            최근 7일간 알림이 없습니다.
          </Text>
        </View>
      )}
    </View>
  );
};

const Notify = ({id, message, createdDate, onPress}) => {
  const {Fonts, Colors} = useTheme();
  const [p, setP] = useState(false);

  const pressed = async () => {
    let a = JSON.parse(await AsyncStorage.getItem('pressedNotification'));
    if (a == null) a = [];
    a.push(id);
    await AsyncStorage.setItem('pressedNotification', JSON.stringify(a));
    setP(true);
    onPress();
  };

  const isPressed = async () => {
    let b = JSON.parse(await AsyncStorage.getItem('pressedNotification'));
    if (b == null) return;
    for (let i = 0; i < b.length; i++) {
      if (b[i] == id) {
        setP(true);
      }
    }
  };

  useEffect(() => {
    isPressed();
  }, [p]);

  return (
    <Pressable
      onPress={pressed}
      style={[
        styles.notiContainer,
        p ? styles.isRead : '',
        {
          backgroundColor: !p
            ? Colors.contentBackground
            : Colors.screenBackground,
          borderBottomWidth: responsiveHeight(1),
          borderBottomColor: Colors.screenBackground,
        },
      ]}>
      <View style={styles.content}>
        <Text style={[Fonts.contentMediumMedium, {color: Colors.textBold}]}>
          {message}
        </Text>
        <Text style={[Fonts.contentMediumMedium, {color: Colors.textNormal}]}>
          {timeAgo(createdDate)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  notiContainer: {
    height: responsiveHeight(65),
    alignItems: 'center',
    justifyContent: 'center',
  },
  isRead: {backgroundColor: '#EAF3FE'},
  profileImg: {
    width: responsiveWidth(35),
    height: responsiveHeight(35),
    borderRadius: responsiveWidth(12),
    marginRight: responsiveWidth(5),
  },
  content: {
    width: responsiveWidth(370),
    height: responsiveHeight(45),
    paddingHorizontal: responsiveWidth(5),
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});

export default Alram;
