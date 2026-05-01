import { useEffect } from "react";

export const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const listener = (event) => {
      
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      console.log("Clicked outside, closing sidebar"); // Debugging log
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
