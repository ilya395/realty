import validator from 'validator';

export function checkPassword(str, min = 5, max = 32) {
  return str && validator.isLength(str, min, max) && /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,}/.test(str);
}