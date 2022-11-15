import React from 'react';
import { Button, Modal } from 'rsuite';
import ModalBody from 'rsuite/lib/Modal/ModalBody';
import ModalFooter from 'rsuite/lib/Modal/ModalFooter';
import ModalHeader from 'rsuite/lib/Modal/ModalHeader';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useModalState } from '../../../misc/custom-hooks';

const RoomInfoBtnModal = () => {
  const { isOpen, close, open } = useModalState();
  const description = useCurrentRoom(v => v.description);
  const name = useCurrentRoom(v => v.name);

  return (
    <>
      <Button appearance="link" className="px-0" onClick={open}>
        Room Info /
      </Button>
      <Modal show={isOpen} onHide={close}>
        <ModalHeader>
          <Modal.Title>About {name}</Modal.Title>
        </ModalHeader>

        <ModalBody>
          <h6 className="mb-2">Description:</h6>
          <p> {description}</p>
        </ModalBody>

        <ModalFooter>
          <Button onClick={close} block>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default RoomInfoBtnModal;
