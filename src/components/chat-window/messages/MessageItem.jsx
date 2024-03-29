import React, { memo } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import ImgBtnModal from './ImgBtnModal';
import ProfileAvatar from '../../dashboard/ProfileAvatar';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';
import { useCurrentRoom } from '../../../context/current-room.context';
import { auth } from '../../../misc/firebase';
import IconBtnControl from './IconBtnControl';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';

const renderFileMessage = file => {
  if (file.contentType.includes('image')) {
    return (
      <div className="height-220">
        <ImgBtnModal src={file.url} fileName={file.name} />
      </div>
    );
  }
  if (file.contentType.includes('audio')) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption, react/no-unknown-property
      <audio controls>
        <source src={file.url} type="audio/mp3" />
        Your browser does not support audio elements
      </audio>
    );
  }
  return <a href={file.url}>Download {file.name}</a>;
};
const MessageItem = ({ message, handleAdmin, handleLike, handleDelete }) => {
  const { author, createdAt, text, file, likes, likeCount } = message;

  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const [selfRef, isHover] = useHover();
  const admins = useCurrentRoom(v => v.admins);
  const isMobile = useMediaQuery('(max-width:992px)');
  const isMsgAuthorAdmin = admins.includes(author.uid);

  const isAuthor = auth.currentUser.uid === author.uid;

  const canGrantAdmin = isAdmin && !isAuthor;
  const canShowIcons = isMobile;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);
  return (
    <li
      className={`padded mb-1 cursor-pointer ${isHover ? 'bg-black-02' : ''}`}
      ref={selfRef}
    >
      <div className="d-flex align-items-center font-bolder mb-1">
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />
        <ProfileInfoBtnModal
          profile={author}
          apperance="link"
          className=" p-0 ml-1 text-black"
        >
          {canGrantAdmin && (
            <Button onClick={() => handleAdmin(author.uid)} block color="blue">
              {isMsgAuthorAdmin ? 'Remove from admin' : 'Add as an admin'}
            </Button>
          )}
        </ProfileInfoBtnModal>
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
        <IconBtnControl
          {...(isLiked ? { color: 'red' } : {})}
          isVisible={canShowIcons}
          iconName="heart"
          tooltip="Like the message"
          onClick={() => {
            handleLike(message.id);
          }}
          badgeContent={likeCount}
        />
        {isAuthor && (
          <IconBtnControl
            isVisible={canShowIcons}
            iconName="close"
            tooltip="Delete the message"
            onClick={() => {
              handleDelete(message.id, file);
            }}
          />
        )}
      </div>
      <div>
        {text && <span className="word-break-all">{text}</span>}
        {file && renderFileMessage(file)}
      </div>
    </li>
  );
};

export default memo(MessageItem);
