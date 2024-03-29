import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';

import ChatTop from '../../components/chat-window/top';
import ChatBottom from '../../components/chat-window/bottom';
import Messages from '../../components/chat-window/messages';
import { useRooms } from '../../context/room.context';
import { CurrentRoomProvider } from '../../context/current-room.context';
import { tranformToArr } from '../../misc/helper';
import { auth } from '../../misc/firebase';

const Chat = () => {
  const { chatId } = useParams();

  const rooms = useRooms();

  if (!rooms)
    return <Loader center vertical speed="slow" size="md" content="Loading" />;

  const currentRoom = rooms.find(room => room.id === chatId);

  if (!currentRoom)
    return <h6 className="text-center mt-page">Chat {chatId} not found</h6>;

  const { name, description } = currentRoom;

  const admins = tranformToArr(currentRoom.admins);
  const isAdmin = admins.includes(auth.currentUser.uid);
  const CurrentRoomData = { name, description, admins, isAdmin };

  console.log(CurrentRoomData);

  return (
    <CurrentRoomProvider data={CurrentRoomData}>
      <div className="chat-top">
        <ChatTop />
      </div>
      <div className="chat-middle">
        <Messages />
      </div>
      <div className="chat-bottom">
        <ChatBottom />
      </div>
    </CurrentRoomProvider>
  );
};

export default Chat;
