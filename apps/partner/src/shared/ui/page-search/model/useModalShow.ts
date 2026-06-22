import { useState } from "react";

export const useModalShow = () => {
  const [setting, setSetting] = useState(false);
  return {
    setting,
    setSetting,
  };
};
