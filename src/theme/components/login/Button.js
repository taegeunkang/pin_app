import {Pressable, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, FontSize} from '../../Variables';
const Button = ({title, onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 7,
    width: 320,
    height: 48,
    elevation: 3,
    marginTop: 15,
    backgroundColor: Colors.DarkGray,
  },
  title: {fontSize: FontSize.regular, color: Colors.white},
});

export default Button;
