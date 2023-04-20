import { Pressable, StyleSheet, Text } from 'react-native';

const Apple = () => {
  return (
    <Pressable style={styles.background}>
      <Text style={{ fontSize: 20, color: '#FFFFFF' }}>A</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#000000',
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

export default Apple;
