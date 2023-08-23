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
import {useState, useRef, useEffect} from 'react';
import {WithLocalSvg} from 'react-native-svg';
import UserCell from '../../components/Content/UserCell';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
// 첫 화면 -> 검색기록 없을 때, 있을 때,
// 검색 후 -> 결과 잇을 때, 없을 때

const FollowingList = ({navigation, route}) => {
  const {userId} = route.params;
  const {t} = useTranslation('content');
  const [inpt, setInpt] = useState('');
  const inputRef = useRef(null);
  const [page, setPage] = useState(0);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const search = async () => {
    if (inpt && inpt.trim().length > 0) {
      const response = await fetch(
        API_URL +
          `/user/following/list?userId=${userId}&word=${inpt}&page=${0}&size=${20}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.status == 200) {
        const r = await response.json();
        setUserList(r);
      }
    } else {
      setUserList([]);
    }
    setPage(0);
  };

  const findFolowingAll = async () => {
    const response = await fetch(
      API_URL + `/user/following/list?userId=${userId}&page=${0}&size=${20}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status == 200) {
      const r = await response.json();
      console.log(r);
      setUserList(r);
    }
    setPage(0);
  };

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);
    const response = await fetch(
      API_URL + `/user/following/list?userId=${userId}&page=${page}&size=${20}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status == 200) {
      const r = await response.json();
      let a = userList;
      a = a.concat(r);
      setUserList(a);
    }
    setLoading(false);
  };

  const fetchDataContainingWord = async () => {
    if (loading) return;
    setLoading(true);
    const response = await fetch(
      API_URL +
        `/user/following/list?userId=${userId}&word=${inpt}&page=${page}&size=${20}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status == 200) {
      const r = await response.json();
      let a = userList;
      a = a.concat(r);
      setUserList(a);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (inpt && inpt.trim().length > 0) {
      search();
    } else {
      findFolowingAll();
    }
  }, [inpt]);

  useEffect(() => {
    if (inpt && inpt.trim().length > 0) {
      fetchDataContainingWord();
    } else {
      fetchData();
    }
  }, [page]);

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
          onChangeText={e => {
            setInpt(e);
            setPage(0);
          }}
          value={inpt}
        />
      </View>

      <View style={{marginTop: responsiveHeight(20)}} />
      {/* 첫 화면 진입시 검색 기록이 존재 하지 않을 때 */}
      {/* <View style={{flex: 1, backgroundColor: Colors.white}}></View> */}

      {/* 검색 결과가 있을 때*/}
      <ScrollView
        onScroll={({nativeEvent}) => {
          if (loading) return;

          const isCloseToBottom =
            nativeEvent.layoutMeasurement.height +
              nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - responsiveHeight(70);
          if (isCloseToBottom) {
            setPage(page => page + 1);
          }
        }}
        scrollEventThrottle={400}>
        {userList.map((user, index) => (
          <UserCell
            key={index}
            name={user.nickname}
            profileImage={user.profileImg}
            onPress={() => navigation.push('UserPage', {userId: user.userId})}
          />
        ))}
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
              fontFamily: 'SpoqaHanSansNeo-Medium',
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
export default FollowingList;
