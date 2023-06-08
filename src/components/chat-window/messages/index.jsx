import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { groupBy, tranformToArrWithId } from '../../../misc/helper';
import { auth, database, storage } from '../../../misc/firebase';
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
            // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleLike = useCallback(async msgId => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);

    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          alertMsg = 'Like removed';
          msg.likes[uid] = null;
          msg.likeCount -= 1;
        } else {
          msg.likeCount += 1;
          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = 'Likes added';
        }
      }

      return msg;
    });
    Alert.info(alertMsg, 4000);
  }, []);

  const handleDelete = useCallback(
    async (msgId, file) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm('Delete this message?')) return;
      const updates = {};
      const isLast = messages[messages.length - 1].id === msgId;
      updates[`/messages/${msgId}`] = null;
      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(updates);
        Alert.success('Message has been deleted', 4000);
      } catch (error) {
        // eslint-disable-next-line consistent-return
        return Alert.error(error.message, 5000);
      }
      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (err) {
          Alert.error(err.message, 6000);
        }
      }
    },
    [chatId, messages]
  );

  const renderMessages = () => {
    const groups = groupBy(messages, item =>
      new Date(item.createdAt).toDateString()
    );

    const items = [];
    Object.keys(groups).forEach(date => {
      items.push(
        <li className="text-center mb-1 padded" key={date}>
          {date}
        </li>
      );

      const msgs = groups[date].map(msg => (
        <MessageItem
          handleLike={handleLike}
          handleAdmin={handleAdmin}
          key={msg.id}
          handleDelete={handleDelete}
          message={msg}
        />
      ));
      items.push(...msgs);
    });
    return items;
  };
  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No Message</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default Messages;
