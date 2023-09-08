import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Text,
  Image,
  SafeAreaView,
} from 'react-native';
import {Colors} from '../../theme/Variables';
import {useTranslation} from 'react-i18next';
import {useState, useRef, useEffect} from 'react';
import UserCell from '../../components/Content/UserCell';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {API_URL} from '../../utils/constants';
import {reIssue} from '../../utils/login';
import {useTheme} from '../../hooks';
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
  const {Images, Fonts, Colors} = useTheme();
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

  useEffect(() => {
    if (inpt && inpt.trim().length > 0) {
      fetchDataContainingWord();
    } else {
      fetchData();
    }
  }, [page]);

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
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginTop: responsiveHeight(20)}} />
      <View style={styles.loginInput}>
        <Image
          source={Images.searchNotSelect}
          style={{
            width: responsiveWidth(25),
            height: responsiveHeight(25),
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
          onChangeText={e => {
            setInpt(e);
            setPage(0);
          }}
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

      {/* 검색 결과가 없을 때 */}
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
                color: Colors.inputContent,
              },
            ]}>
            {t('search.notFound')}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FollowingList;
