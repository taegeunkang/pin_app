import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import Sample1 from '../../theme/assets/images/sample/sample1.png';
import Tag from '../../components/Content/Tag';
import {WithLocalSvg} from 'react-native-svg';
import {BorderRadius, FontSize} from '../../theme/Variables';
import RightArrow from '../../theme/assets/images/arrow-right-solid.svg';
import Plus from '../../theme/assets/images/plus-solid.svg';
import {Switch} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
const WriteContent = ({navigation, route}) => {
  const [text, setText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [submitAva, setSubmitAva] = useState(false);
  const [rotation] = useState(new Animated.Value(0));
  const [toValue, setToValue] = useState(45);
  const [tagging, setTagging] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  // 사진 미니미 + 게시글 작성
  // 위치 지정
  // 함꼐한 친구 추가
  // 작성 버튼
  const {t} = useTranslation('newPost');
  const getLocationName = () => {
    try {
      if (route.params.locationName) {
        setLocationName(route.params.locationName);
        return route.params.locationName;
      }
    } catch {
      return '';
    }
  };

  const check = () => {
    if (text && locationName) {
      setSubmitAva(false);
    } else {
      setSubmitAva(true);
    }
  };

  const moveToFindingLocation = () => {
    navigation.navigate('FindingLocation');
  };

  const submit = () => {
    console.log('clickdddd');
    navigation.reset({routes: [{name: 'Home'}]});
  };
  const onChangeTyping = e => {
    setText(e);
  };
  const rotateComponent = () => {
    Animated.timing(rotation, {
      toValue: toValue,
      duration: 300, // Adjust the duration as per your preference
      useNativeDriver: true,
    }).start();

    setToValue(toValue == 0 ? 45 : 0);
    setTagging(!tagging);
  };
  const inputTag = () => {
    let tagsVar = tags;

    tagsVar.push(tagInput);
    setTags(tagsVar);
    setTagInput('');
    console.log(tagsVar);
  };

  useEffect(() => {
    check();
    getLocationName();
  });

  return (
    <View style={{flex: 1}}>
      <View style={styles.inptContainer}>
        <ImageContainer />
        <View style={styles.inputTextContainer}>
          <View style={styles.inputBox}>
            <TextInput
              value={text}
              placeholder={t('write.content.placeholder')}
              multiline={true}
              style={{
                width: '100%',
                height: '100%',
                textAlignVertical: 'top',
                padding: 5,
              }}
              onChangeText={e => onChangeTyping(e)}
            />
          </View>
        </View>
      </View>

      <View style={{flex: 1, padding: 10}}>
        <View style={styles.listContent}>
          <Text style={{fontSize: FontSize.medium}}>위치</Text>
          <Text>{locationName}</Text>
          {/* {AsyncStorage.getItem('currentLocation') && (
            <Text>{AsyncStorage.getItem('currentLocation')}</Text>
          )} */}
          {/* <WithLocalSvg
            asset={RightArrow}
            width={20}
            height={20}
            onPress={moveToFindingLocation}
          />
           */}

          <TouchableOpacity onPress={moveToFindingLocation}>
            <View>
              <WithLocalSvg asset={Plus} width={20} height={20} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{width: '100%', flexDirection: 'column'}}>
          <View style={styles.listContent}>
            <Text style={{fontSize: FontSize.medium}}>태그</Text>
            {/* {AsyncStorage.getItem('currentLocation') && (
            <Text>{AsyncStorage.getItem('currentLocation')}</Text>
          )} */}

            <TouchableOpacity onPress={rotateComponent}>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: rotation.interpolate({
                        inputRange: [0, 45],
                        outputRange: ['0deg', '45deg'],
                      }),
                    },
                  ],
                }}>
                <WithLocalSvg asset={Plus} width={20} height={20} />
              </Animated.View>
            </TouchableOpacity>
          </View>
          {tagging && (
            <>
              <View style={{width: '100%'}}>
                <TextInput
                  value={tagInput}
                  onChangeText={e => setTagInput(e)}
                  style={{width: '100%'}}
                  placeholder="태그 입력(최대 20자)"
                  onSubmitEditing={inputTag}
                  maxLength={20}
                />
              </View>

              {/* <View style={{width: '100%', marginTop: 20, marginBottom: 20}}>
                <Text>
                  {tags.map((item, idx) => {
                    const colorSet = ['orange', 'red', 'blue', 'green'];
                    return (
                      <Tag
                        key={idx}
                        tagName={item}
                        bgColor={colorSet[idx % colorSet.length]}
                      />
                    );
                  })}
                </Text>
              </View> */}
            </>
          )}
          {tags && tags.length >= 1 && (
            <View style={{width: '100%', marginTop: 20, marginBottom: 20}}>
              <Text>
                {tags.map((item, idx) => {
                  const colorSet = ['orange', 'red', 'blue', 'green'];
                  return (
                    <Tag
                      key={idx}
                      tagName={item}
                      bgColor={colorSet[idx % colorSet.length]}
                    />
                  );
                })}
              </Text>
            </View>
          )}
        </View>
        {/* 친구 기능 추가 후 생성 */}
        {/* <View style={styles.listContent}>
          <Text style={{fontSize: FontSize.medium}}>함꼐한 친구</Text>
          <WithLocalSvg asset={RightArrow} width={20} height={20} />
        </View> */}
        <View style={styles.listContent}>
          <Text style={{fontSize: FontSize.medium}}>비공개</Text>
          <Switch
            value={isPrivate}
            onValueChange={() => setIsPrivate(!isPrivate)}
            color="gray"
          />
        </View>

        <View
          style={{
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 1,
          }}>
          <TouchableOpacity
            style={{
              width: '95%',
              height: 50,
              backgroundColor: '#bcbcbc',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            disabled={submitAva}
            onPress={submit}>
            <Text style={{fontSize: FontSize.medium}}>
              {t('write.content.upload')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const ImageContainer = images => {
  return (
    <View style={styles.imageContainer}>
      <Image style={{width: '100%', height: '100%'}} source={Sample1} />
    </View>
  );
};

const SubmitButton = () => {
  return (
    <Pressable style={{width: '90%', height: 50}}>
      <Text>{t('write.content.upload')}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: Dimensions.get('window').width * 0.3333,
    height: Dimensions.get('window').width * 0.3333,
    borderRadius: BorderRadius.large,
    padding: 10,
  },
  inptContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  inputTextContainer: {
    width: Dimensions.get('window').width * 0.6667,
    padding: 10,
    height: Dimensions.get('window').width * 0.3333,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.medium,
  },
  listContent: {
    width: '100%',
    height: 50,
    fontSize: FontSize.large,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: 'gray',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
});

export default WriteContent;