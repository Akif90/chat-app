/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useContext, useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import { auth, database } from '../misc/firebase';

export const isOfflineForDatabase = {
  state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const profileContext = createContext();
// profileProvider is a compo to provide all its children the context
export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    let userStatusRef;
    const onAuthUnSub = auth.onAuthStateChanged(authObj => {
      if (authObj) {
        // whenever data at this path changes we will be notified by the callback func
        userRef = database.ref(`profiles/${authObj.uid}`);
        userStatusRef = database.ref(`/status/${authObj.uid}`);

        userRef.on('value', snap => {
          const { name, createdAt, avatar } = snap.val(); // Gives data in js Obj format

          const data = {
            name,
            createdAt,
            avatar,
            uid: authObj.uid,
            email: authObj.email,
          };

          setProfile(data);
          setIsLoading(false);
        });
        database.ref('.info/connected').on('value', snapshot => {
          // If we're not currently connected, don't do anything.
          if (snapshot.val() === false) {
            return;
          }

          userStatusRef
            .onDisconnect()
            .set(isOfflineForDatabase)
            .then(() => {
              userStatusRef.set(isOnlineForDatabase);
            });
        });
      } else {
        if (userRef) userRef.off();
        if (userStatusRef) userStatusRef.off();
        database.ref('.info/connected').off();
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      onAuthUnSub();
      if (userRef) userRef.off();
      if (userStatusRef) userStatusRef.off();
      database.ref('.info/connected').off();
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
