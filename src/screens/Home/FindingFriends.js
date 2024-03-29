import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Text,
  SafeAreaView,
  Image,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useState, useRef, useLayoutEffect, useEffect} from 'react';
import FriendsCell from '../../components/Content/FriendsCell';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {TouchableOpacity} from 'react-native';
import {API_URL} from '../../utils/constants';
import {reIssue} from '../../utils/login';
import {useTheme} from '../../hooks';
// 첫 화면 -> 검색기록 없을 때, 있을 때,
// 검색 후 -> 결과 잇을 때, 없을 때

const FindingFriends = ({navigation, route}) => {
  const {userId} = route.params;
  const {t} = useTranslation('content');
  const [inpt, setInpt] = useState('');
  const inputRef = useRef(null);
  const [page, setPage] = useState(0);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const {Images, Colors, Fonts} = useTheme();

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
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await findFolowingAll();
          break;
      }
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
    } else if (response.status == 400) {
      const k = await response.json();
      switch (k['code']) {
        case 'U08':
          await reIssue();
          await fetchDataContainingWord();
          break;
      }
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
            navigation.pop();
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.contentBackground,
      alignItems: 'center',
      paddingVertical: responsiveHeight(20),
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
      marginBottom: responsiveHeight(20),
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginInput}>
        <Image
          source={Images.searchNotSelect}
          style={{
            width: responsiveWidth(25),
            height: responsiveWidth(25),
            resizeMode: 'contain',
          }}
        />

        <TextInput
          ref={inputRef}
          style={{
            flex: 1,
            textAlign: 'left',
            marginLeft: responsiveWidth(10),
            color: Colors.inputContent,
          }}
          placeholder={t('search.user')}
          placeholderTextColor={Colors.inputPlaceHolder}
          onChangeText={e => setInpt(e)}
          value={inpt}
        />
      </View>

      {/* <View style={{marginTop: responsiveHeight(20)}} /> */}
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
          <FriendsCell key={index} user={user} />
        ))}
      </ScrollView>

      {/* 검색 결과가 없을 때*/}
      {inpt && userList && userList.length == 0 && (
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: Colors.contentBackground,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={[
              Fonts.contentMediumMedium,
              {
                color: Colors.textNormal,
              },
            ]}>
            {t('search.notFound')}
          </Text>
          <View style={{marginTop: responsiveHeight(120)}} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default FindingFriends;
