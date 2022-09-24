/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, database } from '../misc/firebase';

const profileContext = createContext();
// profileProvider is a compo to provide all its children the context
export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;

    const onAuthUnSub = auth.onAuthStateChanged(authObj => {
      if (authObj) {
        // whenever data at this path changes we will be notified by the callback func
        userRef = database.ref(`profiles/${authObj.uid}`);

        userRef.on('value', snap => {
          const { name, createdAt } = snap.val(); // Gives data in js Obj format

          const data = {
            name,
            createdAt,
            uid: authObj.uid,
            email: authObj.email,
          };

          setProfile(data);
          setIsLoading(false);
        });
      } else {
        if (userRef) userRef.off();

        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      onAuthUnSub();
      if (userRef) userRef.off();
    };
  }, []);

  return (
    <profileContext.Provider value={{ isLoading, profile }}>
      {children}
    </profileContext.Provider>
  );
};

// to make context more accessible so that we don't have to reference it all the time
export const useProfile = () => useContext(profileContext);
