/**
 * 숫자를 천 단위 콤마 형식으로 포맷팅합니다.
 * @param value 포맷팅할 문자열 값
 * @returns 천 단위 콤마가 적용된 문자열
 */
export const formatNumber = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, '');
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 콤마가 포함된 문자열을 숫자로 변환합니다.
 * @param value 콤마가 포함된 문자열
 * @returns 숫자 값
 */
export const parseFormattedNumber = (value: string): number => {
  return Number(value.replace(/,/g, ''));
};
