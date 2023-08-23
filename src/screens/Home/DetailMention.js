import {StyleSheet, View, ScrollView, SafeAreaView} from 'react-native';
import {Colors} from '../../theme/Variables';
import UserCell from '../../components/Content/UserCell';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {freeze} from '@reduxjs/toolkit';
// 첫 화면 -> 검색기록 없을 때, 있을 때,
// 검색 후 -> 결과 잇을 때, 없을 때

const DetailMention = ({navigation, route}) => {
  const {friends} = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginTop: responsiveHeight(20)}} />
      {/* 첫 화면 진입시 검색 기록이 존재 하지 않을 때 */}
      {/* <View style={{flex: 1, backgroundColor: Colors.white}}></View> */}

      {/* 검색 결과가 있을 때*/}
      <ScrollView scrollEventThrottle={400}>
        {friends.map((friend, index) => (
          <UserCell
            key={index}
            name={friend.nickname}
            profileImage={friend.profileImage}
            onPress={() => {
              navigation.push('UserPage', {userId: friend.userId});
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: responsiveHeight(20),
  },
  loginInput: {
    height: responsiveHeight(48),
    width: responsiveWidth(370),
    borderRadius: responsiveWidth(12),
    backgroundColor: '#F2F4F6',
    paddingHorizontal: responsiveWidth(10),
    color: '#505866',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
export default DetailMention;
