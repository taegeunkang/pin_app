import Google from './Google';
import Facebook from './Facebook';
import Naver from './Naver';
import Apple from './Apple';
import Kakao from './KaKao';
import { View } from 'react-native';
const Sns = ({ googleSigin, kakaoSignin }) => {
  return (
    <View
      style={{
        width: 320,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 30,
      }}
    >
      <Google googleSigin={googleSigin} />
      <Kakao kakaoSignin={kakaoSignin} />
      {/* <Apple /> */}
      {/* <Facebook /> */}
      <Naver />
    </View>
  );
};

export default Sns;
