import {View, StyleSheet, Text} from 'react-native';

const MyPage = () => {
  return (
    <View style={styles.container}>
      <Text>Mypage!!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

export default MyPage;
