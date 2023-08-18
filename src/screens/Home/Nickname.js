import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {useLayoutEffect, useState, useRef} from 'react';
import {useTheme} from '../../hooks';
import SubmitButton from '../../components/SubmitButton';
import InputBox from '../../components/InputBox';
const Nickname = ({navigation}) => {
  const [inpt, setInpt] = useState('');
  const {Fonts, Colors} = useTheme();
  const inputRef = useRef(null);
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
  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current.blur()}>
      <View style={{flex: 1, alignItems: 'center', backgroundColor: '#FFFFFF'}}>
        <View style={{marginTop: responsiveHeight(20)}} />
        <InputBox
          title={'닉네임'}
          placeholder={'닉네임 입력'}
          value={inpt}
          onChangeText={e => setInpt(e)}
          ref={inputRef}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({});
export default Nickname;
