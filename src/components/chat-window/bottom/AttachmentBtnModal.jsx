import { useParams } from 'react-router';
import React, { useState } from 'react';
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import { storage } from '../../../misc/firebase';

const MAX_FILE_SIZE = 1000 * 1024 * 5;
const AttachmentBtnModal = ({ afterUpload }) => {
  const { open, isOpen, close } = useModalState();

  const { chatId } = useParams();

  const [fileList, setFileList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const onChange = fileArr => {
    const filtered = fileArr

      .filter(el => el.blobFile.size <= MAX_FILE_SIZE)

      .slice(0, 5);

    setFileList(filtered);
  };

  const onUpload = async () => {
    try {
      const uploadPromises = fileList.map(f => {
        return storage
          .ref(`/chat/${chatId}`)
          .child(Date.now() + f.name)
          .put(f.blobFile, {
            cacheControl: `public ,max-age = ${3600 * 24 * 3}`,
          });
      });

      const uploadSnapshots = await Promise.all(uploadPromises);

      const shapePromises = uploadSnapshots.map(async snap => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };
      });

      const files = await Promise.all(shapePromises);

      await afterUpload(files);

      setIsLoading(false);

      close();
    } catch (err) {
      setIsLoading(false);
      Alert.error(err.message, 6000);
    }
  };
  return (
    <>
      <InputGroup.Button onClick={open}>
        <Icon icon="attachment" />
      </InputGroup.Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Upload Attachment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            fileList={fileList}
            autoUpload={false}
            action=""
            onChange={onChange}
            multiple
            listType="picture-text"
            className="w-100"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={isLoading} onClick={onUpload} block>
            Send to chat
          </Button>
          <div className="text-right mt-2">
            <small>* only files less than 5mb are allowed</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttachmentBtnModal;
