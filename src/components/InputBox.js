import {View, Text, TextInput, StyleSheet, Dimensions} from 'react-native';
import {useTheme} from '../hooks';
import React from 'react';
import {responsiveHeight, responsiveWidth} from './Scale';
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
    const {Fonts, Colors} = useTheme();

    const styles = StyleSheet.create({
      headerContainer: {
        width: !width ? responsiveWidth(370) : responsiveWidth(width),
        height: responsiveHeight(26),
      },
      loginInput: {
        height: responsiveHeight(48),
        width: !width ? responsiveWidth(370) : responsiveWidth(width),
        borderRadius: responsiveWidth(12),
        backgroundColor: Colors.screenBackground,
        paddingHorizontal: responsiveWidth(10),
        color: Colors.inputContent,
      },
      wrongInput: {
        borderWidth: responsiveWidth(1),
        borderColor: Colors.warn,
      },
    });

    return (
      <>
        <View style={styles.headerContainer}>
          <Text style={[Fonts.inputHeader, {color: Colors.textBold}]}>
            {title}
          </Text>
        </View>
        <TextInput
          style={[
            Fonts.contentRegualrMedium,
            styles.loginInput,
            isWrong ? styles.wrongInput : '',
            {backgroundColor: Colors.inputBackground},
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.inputPlaceHolder}
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

export default InputBox;
