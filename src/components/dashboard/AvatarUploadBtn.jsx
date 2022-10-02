import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Alert, Button, Modal } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import { useModalState } from '../../misc/custom-hooks';
import { database, storage } from '../../misc/firebase';
import ProfileAvatar from './ProfileAvatar';

const fileInputTypes = '.png,.jpg.jpeg';
const acceptedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
const isValidFile = file => acceptedFileTypes.includes(file.type);

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModalState();

  const { profile } = useProfile();

  const [img, setImg] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const avatarEditorRef = useRef();

  const onFileInputChange = ev => {
    const currFiles = ev.target.files;

    if (currFiles.length === 1) {
      const file = currFiles[0];

      if (isValidFile(file)) {
        setImg(file);

        open();
      } else {
        Alert.error('Wrong File Type', 4000);
      }
    }
  };
  const getBlob = canvas => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('File process error'));
        }
      });
    });
  };
  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();
    // can't directly upload canvas element directly to firebase
    // need to convert it to a blob file type which is nothing but data represented
    // im binary form
    // canvas.toBlob();
    setIsLoading(true);
    try {
      const blob = await getBlob(canvas);

      const avatarFileRef = storage
        .ref(`/profiles/${profile.uid}`)
        .child('avatar');

      const uploadAvatarResult = await avatarFileRef.put(blob, {
        cacheControl: `public, max age= ${3600 * 24 * 3}`,
      });

      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();

      const userAvatarRef = database
        .ref(`/profiles/${profile.uid}`)
        .child('avatar');

      userAvatarRef.set(downloadUrl);

      setIsLoading(false);

      Alert.info('Avatar uploaded', 4000);
    } catch (error) {
      setIsLoading(false);

      Alert.error(error.message, 4000);
    }
  };
  return (
    <div className="mt-3 text-center">
      <ProfileAvatar
        src={profile.avatar}
        name={profile.name}
        className="width-200 height-200 img-fullsize font-huge"
      />
      <div>
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointer padded"
        >
          Select New Avatar
          <input
            type="file"
            className="d-none"
            id="avatar-upload"
            accept={fileInputTypes}
            onChange={onFileInputChange}
          />
        </label>

        <Modal show={isOpen} onHide={close}>
          <Modal.Header>
            <Modal.Title>Adjust and upload new avatar </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {img && (
              <div className="text-center">
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={img}
                  width={250}
                  height={250}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                />
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              disabled={isLoading}
              appearance="ghost"
              block
              onClick={onUploadClick}
            >
              Upload avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
