import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { tranformToArrWithId } from '../../../misc/helper';
import { database } from '../../../misc/firebase';
import MessageItem from './MessageItem';

const Messages = () => {
  const { chatId } = useParams();

  let alertMsg = '';

  const [messages, setMessages] = useState(null);

  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);

      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            alertMsg = 'Admin removed';
            admins[uid] = null;
          } else {
            admins[uid] = true;
            alertMsg = 'Admin added';
          }
        }

        return admins;
      });
      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );
  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;
  useEffect(() => {
    const messageRef = database.ref('/messages');

    messageRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = tranformToArrWithId(snap.val());
        setMessages(data);
      });

    return () => {
      messageRef.off();
    };
  }, [chatId]);
  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No Message</li>}
      {canShowMessages &&
        messages.map(msg => {
          return (
            <MessageItem handleAdmin={handleAdmin} key={msg.id} message={msg} />
          );
        })}
    </ul>
  );
};

export default Messages;
