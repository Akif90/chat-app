import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { tranformToArrWithId } from '../../../misc/helper';
import { database } from '../../../misc/firebase';
import MessageItem from './MessageItem';

const Messages = () => {
  const { chatId } = useParams();

  const [messages, setMessages] = useState(null);

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
          return <MessageItem key={msg.id} message={msg} />;
        })}
    </ul>
  );
};

export default Messages;
