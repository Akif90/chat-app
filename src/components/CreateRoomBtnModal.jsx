import React, { useCallback, useState, useRef } from 'react';
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Modal,
  Schema,
} from 'rsuite';

import firebase from 'firebase/compat/app';

import { useModalState } from '../misc/custom-hooks';
import { auth, database } from '../misc/firebase';

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('Chat name is required'),
  description: StringType().isRequired('Description is required'),
});
const INITIAL_FORM = {
  name: '',
  description: '',
};
const CreateRoomBtnModal = () => {
  const { open, close, isOpen } = useModalState();

  const [formValue, setFormValue] = useState(INITIAL_FORM);

  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef();
  const onFormChange = useCallback(value => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    // check func available on form component
    // which we access with the help of ref Hook
    // returns true if it validates the form data
    if (!formRef.current.check()) {
      return;
    }

    setIsLoading(true);

    const newRoomData = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      admins: {
        [auth.currentUser.uid]: true,
      },
    };

    try {
      await database.ref('rooms').push(newRoomData);
      Alert.info(`${formValue.name} room created`, 4000);
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close();
    } catch (er) {
      setIsLoading(false);

      Alert.error(er.message);
    }
  };
  return (
    <div className="mt-2">
      <Button block color="green" onClick={open}>
        <Icon icon="creative" /> Create New Chat Room
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>New chat room </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            model={model}
            fluid
            onChange={onFormChange}
            formValue={formValue}
            ref={formRef}
          >
            <FormGroup>
              <ControlLabel>Room Name</ControlLabel>

              <FormControl name="name" placeholder="Enter chat room name" />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Room Description</ControlLabel>

              <FormControl
                rows={5}
                componentClass="textarea"
                name="description"
                placeholder="Description"
              />
            </FormGroup>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            block
            appearance="primary"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Create New Chat Room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoomBtnModal;
