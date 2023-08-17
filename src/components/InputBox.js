import {View, Text, TextInput, StyleSheet} from 'react-native';
import {useTheme} from '../hooks';
import React from 'react';

const InputBox = React.forwardRef(
  (
    {
      title,
      placeholder,
      onChangeText,
      value,
      isWrong,
      passwordInvisible,
      width,
      maxLength,
      editable,
      keyboardType,
    },
    ref,
  ) => {
    const {Fonts} = useTheme();

    return (
      <>
        <View style={[!width ? {width: 370} : {width: width}, {height: 26}]}>
          <Text style={Fonts.inputHeader}>{title}</Text>
        </View>
        <TextInput
          style={[
            !width ? {width: 370} : {width: width},
            styles.loginInput,
            isWrong ? styles.wrongInput : '',
          ]}
          placeholder={placeholder}
          placeholderTextColor={'#6D7582'}
          onChangeText={onChangeText}
          secureTextEntry={passwordInvisible}
          value={value}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={!editable}
          ref={ref}
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
  loginInput: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F2F4F6',
    paddingHorizontal: 10,
    color: '#505866',
  },
  wrongInput: {
    borderWidth: 1,
    borderColor: '#E44949',
  },
});

export default InputBox;
