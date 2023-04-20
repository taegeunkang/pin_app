import { useEffect, useState } from 'react';
import { useSSR } from 'react-i18next';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Colors } from '../../theme/Variables';
import Geolocation from '@react-native-community/geolocation';

const Navbar = ({ move }) => {
  const [oneClicked, setOneClicked] = useState(true);
  const [twoClicked, setTwoClicked] = useState(false);
  const [thirdClicked, setThirdClicked] = useState(false);
  const [fourthClicked, setFourthClicked] = useState(false);
  const [fivthClicked, setFivthClicked] = useState(false);

  const select = button => {
    allReset();
    switch (button) {
      case 'one':
        setOneClicked(true);
        break;
      case 'two':
        setTwoClicked(true);
        break;
      case 'three':
        setThirdClicked(true);
        break;
      case 'four':
        setFourthClicked(true);
        break;
      case 'five':
        setFivthClicked(true);
        move('MyPage');
        break;
    }
  };

  const allReset = () => {
    setOneClicked(false);
    setTwoClicked(false);
    setThirdClicked(false);
    setFourthClicked(false);
    setFivthClicked(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          height: 4,
          backgroundColor: Colors.transparent,
          flexDirection: 'row',
        }}
      >
        <View
          style={[
            { width: '20%', height: 2 },
            oneClicked ? styles.tabContainerClicked : {},
          ]}
        />
        <View
          style={[
            { width: '20%', height: 2 },
            twoClicked ? styles.tabContainerClicked : {},
          ]}
        />
        <View
          style={[
            { width: '20%', height: 2 },
            thirdClicked ? styles.tabContainerClicked : {},
          ]}
        />
        <View
          style={[
            { width: '20%', height: 2 },
            fourthClicked ? styles.tabContainerClicked : {},
          ]}
        />
        <View
          style={[
            { width: '20%', height: 2 },
            fivthClicked ? styles.tabContainerClicked : {},
          ]}
        />
      </View>
      <View style={{ width: '100%', height: '100%', flexDirection: 'row' }}>
        <Pressable style={[styles.tabContainer]} onPress={() => select('one')}>
          <View style={[styles.tab]}></View>
          <Text>피드</Text>
        </Pressable>
        <Pressable style={[styles.tabContainer]} onPress={() => select('two')}>
          <View style={[styles.tab]}></View>
          <Text>인기</Text>
        </Pressable>
        <Pressable
          style={[styles.tabContainer]}
          onPress={() => select('three')}
        >
          <View style={[styles.tab]}></View>
        </Pressable>
        <Pressable style={[styles.tabContainer]} onPress={() => select('four')}>
          <View style={[styles.tab]}></View>
          <Text>여정</Text>
        </Pressable>
        <Pressable style={[styles.tabContainer]} onPress={() => select('five')}>
          <View style={[styles.tab]}></View>
          <Text>My</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 90,
    zIndex: 1000,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabContainerClicked: {
    borderTopWidth: 2,
  },
  tab: {
    width: 26,
    height: 26,
    borderRadius: 100,
    backgroundColor: Colors.lightGray,
  },
  tabClicked: {
    backgroundColor: Colors.DarkGray,
  },
});

export default Navbar;
