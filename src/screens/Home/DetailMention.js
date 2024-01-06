import {StyleSheet, View, ScrollView, SafeAreaView} from 'react-native';
import {Colors} from '../../theme/Variables';
import UserCell from '../../components/Content/UserCell';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {freeze} from '@reduxjs/toolkit';
import {useTheme} from '../../hooks';
// 첫 화면 -> 검색기록 없을 때, 있을 때,
// 검색 후 -> 결과 잇을 때, 없을 때

const DetailMention = ({navigation, route}) => {
  const {friends} = route.params;
  const {Fonts, Colors} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.contentBackground,
      alignItems: 'center',
    },
    loginInput: {
      height: responsiveHeight(48),
      width: responsiveWidth(370),
      borderRadius: responsiveWidth(12),
      backgroundColor: Colors.inputBackground,
      paddingHorizontal: responsiveWidth(10),
      color: Colors.inputContent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      {/* 첫 화면 진입시 검색 기록이 존재 하지 않을 때 */}
      {/* <View style={{flex: 1, backgroundColor: Colors.white}}></View> */}

      {/* 검색 결과가 있을 때*/}
      <ScrollView scrollEventThrottle={400} style={{width: '100%'}}>
        <View style={{width: '100%', alignItems: 'center'}}>
          {friends.map((friend, index) => (
            <View style={{width: responsiveWidth(370)}}>
              <UserCell
                key={index}
                name={friend.nickname}
                profileImage={friend.profileImage}
                onPress={() => {
                  navigation.push('UserPage', {userId: friend.userId});
                }}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailMention;
