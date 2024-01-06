import {View, StyleSheet, Image, Text, Pressable} from 'react-native';
import {useTheme} from '../../hooks';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {API_URL} from '../../utils/constants';
import {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import {addFriends, subFriends} from '../../store/friends';

const FriendsCell = ({user}) => {
  const [added, setAdded] = useState(false);
  const {Fonts, Colors, Images} = useTheme();
  const dispatch = useDispatch();
  const friendsList = useSelector(state => state.friends.friends);
  const onAdd = async () => {
    dispatch(addFriends({user: user}));
    setAdded(true);
  };

  const onSub = async () => {
    dispatch(subFriends({user: user}));
    setAdded(false);
  };

  const isSelectedUser = async () => {
    for (let i = 0; i < friendsList.length; i++) {
      if (friendsList[i].userId == user.userId) {
        console.log('있음');
        setAdded(true);
        return;
      }
    }
    console.log('없음');
    setAdded(false);
  };

  useEffect(() => {
    isSelectedUser();
  }, [added]);

  const styles = StyleSheet.create({
    container: {
      width: responsiveWidth(370),
      height: responsiveHeight(45),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.contentBackground,
    },
    nickname: {
      marginLeft: responsiveWidth(5),
      color: Colors.textNormal,
    },
  });

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <FastImage
          source={{
            uri: API_URL + `/user/profile/image?watch=${user.profileImg}`,
            priority: FastImage.priority.high,
          }}
          style={{
            width: responsiveWidth(35),
            height: responsiveWidth(35),
            borderRadius: responsiveWidth(12),
            backgroundColor: Colors.screenBackground,
          }}
        />
        <Text style={[styles.nickname, Fonts.contentMediumMedium]}>
          {user.nickname}
        </Text>
      </View>
      {added ? (
        <Pressable
          style={{width: responsiveWidth(20), height: responsiveHeight(20)}}
          onPress={onSub}>
          <Image
            source={Images.close}
            style={{width: responsiveWidth(15), height: responsiveHeight(15)}}
          />
        </Pressable>
      ) : (
        <Pressable
          style={{width: responsiveWidth(20), height: responsiveHeight(20)}}
          onPress={onAdd}>
          <Image
            source={Images.plus}
            style={{width: responsiveWidth(15), height: responsiveHeight(15)}}
          />
        </Pressable>
      )}
    </View>
  );
};

export default FriendsCell;
