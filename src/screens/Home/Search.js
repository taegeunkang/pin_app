import {
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../../theme/Variables';
import SearchIconNot from '../../theme/assets/images/light/search-not-select.svg';
import {useTranslation} from 'react-i18next';
import {useState, useRef, useEffect} from 'react';
import {WithLocalSvg} from 'react-native-svg';
import UserCell from '../../components/Content/UserCell';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';
import {reIssue} from '../../utils/login';
// 첫 화면 -> 검색기록 없을 때, 있을 때,
// 검색 후 -> 결과 잇을 때, 없을 때

const Search = ({navigation}) => {
  const {t} = useTranslation('content');
  const [inpt, setInpt] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const inputRef = useRef(null);

  const getSearchHistory = async () => {
    const history = await AsyncStorage.getItem('searchHistory');
    setSearchHistory(JSON.parse(history));
  };
  const saveToSearchHistory = async user => {
    let history = JSON.parse(await AsyncStorage.getItem('searchHistory'));
    if (!history) history = [];
    let h = history.concat(user);
    let res = [];
    // 중복 제거
    if (h.length > 0) {
      res.push(h[0]);
      let before = h[0];
      for (let i = 0; i < h.length; i++) {
        if (before.userId == h[i].userId) {
          continue;
        }
        res.push(h[i]);
        before = h[i];
      }
    }

    await AsyncStorage.setItem('searchHistory', JSON.stringify(res));
    setSearchHistory(h);
  };

  const removeHistory = async user => {
    let h = searchHistory;
    let res = [];
    for (let i = 0; i < h.length; i++) {
      if (h[i].userId == user.userId) {
        continue;
      }
      res.push(h[i]);
    }
    setSearchHistory(res);
    await AsyncStorage.setItem('searchHistory', JSON.stringify(res));
  };

  const search = async () => {
    if (inpt && inpt.trim().length > 0) {
      const response = await fetch(API_URL + '/user/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        },
        body: JSON.stringify({word: inpt, page: 0, size: 20}),
      });
      if (response.status == 200) {
        const r = await response.json();
        setUserList(r);
      } else if (response.status == 400) {
        const k = await response.json();
        switch (k['code']) {
          case 'U08':
            await reIssue();
            await search();
            break;
        }
      }
    } else {
      setUserList([]);
      getSearchHistory();
    }
    setPage(0);
  };

  const fetchData = async () => {
    if (inpt && inpt.trim().length > 0) {
      setLoading(true);
      const response = await fetch(API_URL + '/user/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        },
        body: JSON.stringify({word: inpt, page: page + 1, size: 20}),
      });
      if (response.status == 200) {
        const r = await response.json();
        if (r.length > 0) setPage(page + 1);
        let a = userList;
        a = a.concat(r);
        setUserList(a);
      } else if (response.status == 400) {
        const k = await response.json();
        switch (k['code']) {
          case 'U08':
            await reIssue();
            await fetchData();
            break;
        }
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, [inpt]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginInput}>
        <SearchIconNot
          width={responsiveWidth(25)}
          height={responsiveHeight(25)}
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
      {searchHistory && searchHistory.length > 0 && inpt.length == 0 && (
        <ScrollView>
          <View
            style={{
              width: responsiveWidth(370),
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <Text
              style={{
                fontFamily: 'SpoqaHanSansNeo-Bold',
                fontSize: responsiveWidth(12),
                lineHeight: responsiveHeight(18),
                letterSpacing: responsiveWidth(-0.6),
              }}>
              {t('search.history')}
            </Text>
          </View>
          {searchHistory.map((history, index) => (
            <UserCell
              key={index}
              name={history.nickname}
              profileImage={history.profileImg}
              closeAvailable={true}
              onPress={() =>
                navigation.push('UserPage', {userId: history.userId})
              }
              onClose={() => removeHistory(history)}
            />
          ))}
        </ScrollView>
      )}
      {/* <View style={{flex: 1, backgroundColor: Colors.white}}></View> */}

      {inpt.length > 0 && userList && userList.length > 0 && (
        <ScrollView
          onScroll={({nativeEvent}) => {
            if (loading) return;

            const isCloseToBottom =
              nativeEvent.layoutMeasurement.height +
                nativeEvent.contentOffset.y >=
              nativeEvent.contentSize.height - responsiveHeight(70);
            if (isCloseToBottom) {
              fetchData();
            }
          }}
          scrollEventThrottle={400}>
          {/* 검색 결과가 있을 때*/}

          {userList.map((user, index) => (
            <UserCell
              key={index}
              profileImage={user.profileImg}
              name={user.nickname}
              onPress={() => {
                saveToSearchHistory(user);
                navigation.push('UserPage', {userId: user.userId});
              }}
            />
          ))}

          {/* {loading && (
            <View style={{marginVertical: responsiveHeight(20)}}>
              <ActivityIndicator color={'#4880EE'} size={'large'} />
            </View>
          )} */}
        </ScrollView>
      )}

      {/* 검색 결과가 없을 때*/}
      {inpt && userList && userList.length == 0 && (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'SpoqaHanSansNeo-Medium',
              fontSize: responsiveWidth(14),
              lineHeight: responsiveHeight(20),
              letterSpacing: responsiveWidth(-0.6),
              color: '#505866',
            }}>
            {t('search.notFound')}
          </Text>
        </View>
      )}
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
export default Search;
