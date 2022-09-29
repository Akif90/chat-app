import React from 'react';
import { Button, Drawer } from 'rsuite';
import { useProfile } from '../../context/profile.context';

const DashBoard = ({ onSignOut }) => {
  const { profile } = useProfile();
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <h3> This is {profile.name}</h3>
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
