import React, { memo } from 'react';
import { Alert, Button, Drawer } from 'rsuite';
import { useParams } from 'react-router';
import { database } from '../../../misc/firebase';
import { useMediaQuery, useModalState } from '../../../misc/custom-hooks';
import EditableInput from '../../EditableInput';
import { useCurrentRoom } from '../../../context/current-room.context';

const EditRoomBtnDrawer = () => {
  const { open, isOpen, close } = useModalState();
  const isMobile = useMediaQuery('(max-width: 992px');
  const name = useCurrentRoom(v => v.name);
  const description = useCurrentRoom(v => v.description);
  const { chatId } = useParams();

  const updateData = (key, value) => {
    database
      .ref(`rooms/${chatId}`)
      .child(key)
      .set(value)
      .then(() => {
        Alert.success('Updated', 4000);
      })
      .catch(er => {
        Alert.error(er.message, 4000);
      });
  };
  const onNameSave = newName => {
    updateData('name', newName);
  };
  const onDescriptionSave = newDescription => {
    updateData('description', newDescription);
  };
  return (
    <div>
      <Button className="br-circle " size="sm" color="red" onClick={open}>
        A
      </Button>
      <Drawer show={isOpen} full={isMobile} onHide={close} placement="right">
        <Drawer.Header>
          <Drawer.Title>Edit Room</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <EditableInput
            initialValue={name}
            onSave={onNameSave}
            label={<h6 className="mb-2">Name</h6>}
            emptyMsg="Name can not be empty"
          />
          <EditableInput
            componentClass="textarea"
            rows={5}
            wrapperClassName="mt-3"
            initialValue={description}
            onSave={onDescriptionSave}
            emptyMsg="Description can not be empty"
          />
        </Drawer.Body>
        <Drawer.Footer>
          <Button onClick={close} block>
            Close
          </Button>
        </Drawer.Footer>
      </Drawer>
    </div>
  );
};

export default memo(EditRoomBtnDrawer);
