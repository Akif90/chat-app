import React, { useContext, createContext, useState, useEffect } from 'react';
import { database } from '../misc/firebase';
import { tranformToArrWithId } from '../misc/helper';

const RoomsContext = createContext();
export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState(null);
  useEffect(() => {
    const roomListRef = database.ref('rooms');

    roomListRef.on('value', snap => {
      const data = tranformToArrWithId(snap.val());
      setRooms(data);
      // console.log(data);

      return () => {
        roomListRef.off();
      };
    });
  }, []);

  return (
    <RoomsContext.Provider value={rooms}>{children}</RoomsContext.Provider>
  );
};
export const useRooms = () => useContext(RoomsContext);
