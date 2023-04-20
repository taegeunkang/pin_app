export const password_test = password => {
  let reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{8,20}$/;
  result = reg.test(password);
  return result;
};
