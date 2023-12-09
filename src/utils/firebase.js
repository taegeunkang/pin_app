import messaging from '@react-native-firebase/messaging';
export async function getToken() {
  // 권한을 요청하고 토큰을 가져옵니다
  const token = await messaging().getToken();

  if (token) {
    console.log('Your Firebase Token is:', token);
  } else {
    console.log('Failed to get Firebase token.');
  }
}

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getToken(); // 권한이 허용되면 토큰을 가져옵니다.
  }
}
export async function getMessage() {
  messaging().onMessage(async remoteMessage => {
    console.log('[Remote Message] ', JSON.stringify(remoteMessage));
  });
}
