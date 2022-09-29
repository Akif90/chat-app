import React, { useCallback } from 'react';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import DashBoard from '.';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks';
import { auth } from '../../misc/firebase';

const DashBoardToggle = () => {
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery('(max-width:800px'); // it accepts a media breaking point
  // isMobile is a boolean var, it is true if we are at the particular max-width
  // otherwise it is false

  const onSignOut = useCallback(() => {
    auth.signOut();
    Alert.info('Signed Out', 4000);
    close();
  }, [close]);
  return (
    <>
      <Button block color="blue" onClick={open}>
        <Icon icon="dashboard">Dashboard</Icon>
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
        <DashBoard onSignOut={onSignOut} />
      </Drawer>
    </>
  );
};

export default DashBoardToggle;
