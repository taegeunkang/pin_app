import { Pressable, StyleSheet, Text } from 'react-native';

const Facebook = () => {
  return (
    <Pressable style={styles.background}>
      <Text style={{ fontSize: 20 }}>F</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#3A6AF6',
    width: 45,
    height: 45,
    borderRadius: 100,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
});

export default Facebook;
