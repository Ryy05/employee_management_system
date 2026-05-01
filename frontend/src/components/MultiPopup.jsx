import React, { useRef } from 'react';
import { Cross } from '@/icons/ImportIcons';
import { useState, useCallback, useEffect } from 'react';

export const useMultiPopup = () => {
  const [popupType, setPopupType] = useState(null);

  const openPopup = useCallback((type) => {
    if (!type) {
      console.error('Popup type must be specified');
      return;
    }
    setPopupType(type);
  }, []);

  const closePopup = useCallback(() => {
    setPopupType(null);
  }, []);

  return { popupType, openPopup, closePopup };
};

export const MultiPopup = ({ popupType, closePopup, children, loading }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    if (popupType) {
      console.log(`Popup opened: ${popupType}`);
    }
    return () => {
      console.log(`Popup closed`);
    };
  }, [popupType]);

  if (!popupType) return null;

  return (
    <div className="fixed inset-0 px-4 md:px-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {!loading ? (
        <div ref={popupRef} className="flex flex-col space-y-1">
          <div onClick={closePopup} className="cursor-pointer w-full flex justify-end mt-0">
            <Cross />
          </div>
          <div className="bg-white relative w-auto md:max-h-[90vh] max-h-[60vh] overflow-auto p-5 scrollbar-thin">
            <div>{children}</div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="border-t-transparent border-orange-500 w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
