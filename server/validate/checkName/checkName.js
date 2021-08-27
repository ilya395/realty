import validator from 'validator';

export function checkName(str, min = 5, max = 16) {
  return str && validator.isLength(str, min, max); // && /[\u4e00-\u9fa5]/.test(str);
}