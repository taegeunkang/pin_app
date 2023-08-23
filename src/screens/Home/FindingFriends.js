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
import {useState, useRef, useLayoutEffect, useEffect} from 'react';
import {WithLocalSvg} from 'react-native-svg';
import FriendsCell from '../../components/Content/FriendsCell';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {TouchableOpacity} from 'react-native';
import {API_URL} from '../../utils/constants';
import UserCell from '../../components/Content/UserCell';
// 첫 화면 -> 검색기록 없을 때, 있을 때,
// 검색 후 -> 결과 잇을 때, 없을 때

const FindingFriends = ({navigation, route}) => {
  const {userId, selectedFriends} = route.params;
  const {t} = useTranslation('content');
  const [inpt, setInpt] = useState('');
  const inputRef = useRef(null);
  const [page, setPage] = useState(0);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [friendsList, setFriendsList] = useState([]);

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
      setUserList(r);
    }
    setPage(0);
  };

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);

    const response = await fetch(
      API_URL +
        `/user/following/list?userId=${userId}&page=${page + 1}&size=${20}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status == 200) {
      const r = await response.json();
      if (r.lenght > 0) setPage(page + 1);
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
        `/user/following/list?userId=${userId}&word=${inpt}&page=${
          page + 1
        }&size=${20}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status == 200) {
      const r = await response.json();
      if (r.length > 0) setPage(page + 1);
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

  useEffect(() => {}, [page]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WriteContent', {
              friends: friendsList,
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

  const addFriends = async user => {
    console.log(user);
    console.log('add');
    let a = friendsList;
    a = a.concat(user);
    console.log(a);
    setFriendsList(a);
  };

  const subFriends = async user => {
    console.log(user);
    console.log('sub');
    let a = [];
    for (let i = 0; i < friendsList; i++) {
      if (friendsList[i].userId == user.userId) {
        continue;
      }
      a.push(friendsList[i]);
    }
    setFriendsList(a);
    console.log(a);
  };

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
      <ScrollView
        onScroll={({nativeEvent}) => {
          if (loading) return;

          const isCloseToBottom =
            nativeEvent.layoutMeasurement.height +
              nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - responsiveHeight(70);
          if (isCloseToBottom) {
            if (inpt && inpt.trim().length > 0) {
              fetchDataContainingWord();
            } else {
              fetchData();
            }
          }
        }}
        scrollEventThrottle={400}>
        {userList.map((user, index) => (
          <FriendsCell
            key={index}
            nickname={user.nickname}
            profileImage={user.profileImg}
            onAdd={() => addFriends(user)}
            onSub={() => subFriends(user)}
            onPress={() => navigation.push('UserPage', {userId: user.userId})}
          />
        ))}
      </ScrollView>

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
export default FindingFriends;
