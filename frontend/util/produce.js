import { produce, enableES5 } from 'immer';

/**
 ** IE에서 immer를 사용하기
 */
export default (...args) => {
  enableES5();
  return produce(...args);
};
