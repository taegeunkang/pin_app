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
import {useState, useRef} from 'react';
import {WithLocalSvg} from 'react-native-svg';
import UserCell from '../../components/Content/UserCell';

// 첫 화면 -> 검색기록 없을 때, 있을 때,
// 검색 후 -> 결과 잇을 때, 없을 때

const FollowingList = () => {
  const {t} = useTranslation('content');
  const [inpt, setInpt] = useState('');
  const inputRef = useRef(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginInput}>
        <WithLocalSvg width={25} height={25} asset={SearchIconNot} />

        <TextInput
          ref={inputRef}
          style={{flex: 1, textAlign: 'left', marginLeft: 10}}
          placeholder={t('search.user')}
          placeholderTextColor={'#6D7582'}
          onChangeText={e => setInpt(e)}
          value={inpt}
        />
      </View>

      <View style={{marginTop: 20}} />
      {/* 첫 화면 진입시 검색 기록이 존재 하지 않을 때 */}
      {/* <View style={{flex: 1, backgroundColor: Colors.white}}></View> */}

      {/* 검색 결과가 있을 때*/}
      <ScrollView>
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
        <UserCell />
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
    paddingVertical: 20,
  },
  loginInput: {
    height: 48,
    width: 370,
    borderRadius: 12,
    backgroundColor: '#F2F4F6',
    paddingHorizontal: 10,
    color: '#505866',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
export default FollowingList;
