import {View, Text} from 'react-native';
import {BorderRadius} from '../../theme/Variables';

const Tag = ({tagName, bgColor}) => {
  return (
    <View>
      <Text
        style={{
          backgroundColor: bgColor,
          borderRadius: BorderRadius.large,
          alignSelf: 'flex-start',
          paddingHorizontal: 7,
          paddingVertical: 5,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 7,
        }}>
        {tagName}
      </Text>
    </View>
  );
};

export default Tag;
