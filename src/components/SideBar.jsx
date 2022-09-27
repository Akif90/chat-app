import React from 'react';
import DashBoardToggle from './dashboard/DashBoardToggle';

const SideBar = () => {
  return (
    <div className="h-100 pt-2">
      <div>
        <DashBoardToggle />
      </div>
    </div>
  );
};

export default SideBar;
