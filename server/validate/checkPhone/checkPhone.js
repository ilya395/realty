import validator from 'validator';

export function checkPhoneNum(str) {
  return str && validator.isNumeric(str.toString());
  // return str && validator.isMobilePhone(str.toString(), 'ru-RU');
 }