import validator from 'validator';

export function checkEmail(str) {
  return str && validator.isEmail(str);
}