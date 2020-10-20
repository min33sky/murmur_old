import { useState } from 'react';

/**
 * Input 상태를 관리하는 커스텀 훅
 */
const useInput = (defaultValue = null) => {
  const [value, setValue] = useState(defaultValue);
  const handler = (e) => {
    setValue(e.target.value);
  };
  return [value, handler, setValue];
};

export default useInput;
