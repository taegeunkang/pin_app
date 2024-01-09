// 컨텐츠의 생성 시간을 표시
// ~초전 or ~분전으로 표시하고 일주일이 넘어가면 날짜로 표시
export const getUtcPlus9Time = () => {
  // 현재 시간을 얻습니다.
  const currentDate = new Date();

  // UTC+9의 시간을 구합니다.
  const utcPlus9Time = new Date(currentDate.getTime() + 9 * 60 * 60 * 1000);

  // Date.UTC() 메소드에 필요한 매개변수를 추출합니다.
  const year = utcPlus9Time.getUTCFullYear();
  const month = utcPlus9Time.getUTCMonth();
  const day = utcPlus9Time.getUTCDate();
  const hours = utcPlus9Time.getUTCHours();
  const minutes = utcPlus9Time.getUTCMinutes();
  const seconds = utcPlus9Time.getUTCSeconds();

  // Date.UTC() 메소드를 사용하여 UTC+9의 시간을 반환합니다.
  const utcPlus9Timestamp = Date.UTC(year, month, day, hours, minutes, seconds);

  return new Date(utcPlus9Timestamp);
};
export const timeAgo = dateInput => {
  const utcNow = getUtcPlus9Time();
  // 컨텐츠 생성 시간

  const date = new Date(dateInput);
  const utcDate = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
  const seconds = Math.floor((utcNow - utcDate) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) {
    return `방금 전`;
  } else if (minutes < 60) {
    return `${minutes}분전`;
  } else if (hours < 24) {
    return `${hours}시간전`;
  } else if (days <= 7) {
    return `${days}일전`;
  } else {
    // mm.dd.YYYY 형식으로 반환
    const year = date.getFullYear();
    // 월은 0부터 시작하기 때문에 1을 더해줍니다.
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}.${year}`;
  }
};
