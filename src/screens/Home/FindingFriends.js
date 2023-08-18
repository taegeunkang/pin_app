import {
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Text,
  SafeAreaView,
} from 'react-native';
import {Colors} from '../../theme/Variables';
import SearchIcon from '../../theme/assets/images/nav/search.svg';
import SearchIconNot from '../../theme/assets/images/nav/search-not.svg';
import {useTranslation} from 'react-i18next';
import {useState, useRef, useLayoutEffect} from 'react';
import {WithLocalSvg} from 'react-native-svg';
import FriendsCell from '../../components/Content/FriendsCell';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {TouchableOpacity} from 'react-native';
// 첫 화면 -> 검색기록 없을 때, 있을 때,
// 검색 후 -> 결과 잇을 때, 없을 때

const FindingFriends = ({navigation}) => {
  const {t} = useTranslation('content');
  const [inpt, setInpt] = useState('');
  const inputRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WriteContent', {
              friends: [
                {nickname: 'mars2727'},
                {nickname: 'user01'},
                {nickname: 'hanaX'},
              ],
            });
          }}
          style={{
            backgroundColor: Colors.transparent,
            width: responsiveWidth(60),
            height: responsiveHeight(30),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'SpoqaHanSansNeo-Bold',
              fontSize: responsiveWidth(14),
              lineHeight: responsiveHeight(24),
              letterSpacing: responsiveWidth(-0.6),
              color: '#4880EE',
            }}>
            완료
          </Text>
        </TouchableOpacity>
      ),
    });
  });

  const addFriends = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginInput}>
        <WithLocalSvg
          width={responsiveWidth(25)}
          height={responsiveHeight(25)}
          asset={SearchIconNot}
        />

        <TextInput
          ref={inputRef}
          style={{flex: 1, textAlign: 'left', marginLeft: responsiveWidth(10)}}
          placeholder={t('search.user')}
          placeholderTextColor={'#6D7582'}
          onChangeText={e => setInpt(e)}
          value={inpt}
        />
      </View>

      <View style={{marginTop: responsiveHeight(20)}} />
      {/* 첫 화면 진입시 검색 기록이 존재 하지 않을 때 */}
      {/* <View style={{flex: 1, backgroundColor: Colors.white}}></View> */}

      {/* 검색 결과가 있을 때*/}
      <ScrollView>
        <FriendsCell closeAvailable={true} />
        <FriendsCell />
        <FriendsCell />
        <FriendsCell />
        <FriendsCell />
        <FriendsCell />
        <FriendsCell />
        <FriendsCell />
        <FriendsCell />
        <FriendsCell />
        <FriendsCell />
      </ScrollView>

      {/* 검색 결과가 없을 때*/}
      {/* 
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.white,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'SpoqaHanSansNeo-Regular',
                  fontSize: 14,
                  lineHeight: 20,
                  letterSpacing: -0.6,
                }}>
                {t('search.notFound')}
              </Text>
            </View> */}
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
export default FindingFriends;
