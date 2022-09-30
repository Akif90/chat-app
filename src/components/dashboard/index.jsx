import React from 'react';
import { Button, Divider, Drawer } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import EditableInput from '../EditableInput';

const DashBoard = ({ onSignOut }) => {
  const { profile } = useProfile();
  const onSave = async newData => {
    console.log(newData);
  };
  console.log(profile.name);
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <h3> This is {profile.name}</h3>
        <Divider />
        <EditableInput
          name="nickname"
          label={<h6 className="mb-2">Nickname</h6>}
          initialValue={profile.name}
          onSave={onSave}
        />
      </Drawer.Body>

      <Drawer.Footer>
        <Button block color="red" onClick={onSignOut}>
          Sign out
        </Button>
      </Drawer.Footer>
    </>
  );
};
// we have used the index.js name so that we can import
// just by calling the folder instead of the file
export default DashBoard;
