import { FunctionComponent, useState } from "react";
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
// import { ProSidebar, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';

import 'react-pro-sidebar/dist/css/styles.css';
// import '../App.css'
import { TiPencil } from 'react-icons/ti';
import { GiAudioCassette } from 'react-icons/gi';
import { BiCodeCurly, BiArrowFromRight, BiArrowFromLeft } from 'react-icons/bi';
import { BsArrowBarLeft, BsArrowBarRight, BsBoxArrowLeft, BsBoxArrowRight } from 'react-icons/bs';
// import { FaBeer } from 'react-icons/fa';
// import FaPencil from 'react-icons/lib/fa/pencil'

// import { FaCalendarAlt } from "react-icons/fa";


const icons = {
  menuClosed: <BiArrowFromLeft />,
  menuOpen: <BiArrowFromRight />,
  library: <GiAudioCassette />,
  sourceCode: <BiCodeCurly />,
  contact: <TiPencil />,
};

interface ISidebarProps {
  isMobile?: boolean;
}

const Sidebar: FunctionComponent<ISidebarProps> = (props: ISidebarProps) => {
  // if it's mobile, start closed
  const [isClosed, setIsClosed] = useState(props.isMobile == true);

  // display properties
  let title = isClosed ? "BzJ" : "BazamJam";
  let width = props.isMobile ? "20px" : "175px";
  let openCloseIcon = isClosed ? icons.menuClosed : icons.menuOpen;

  // functions
  let handleClose = () => setIsClosed(!isClosed);

  // logic
  if (props.isMobile && !isClosed) {
    setIsClosed(true);
  }

  return (
    <div className="sidebar">
      <ProSidebar collapsed={isClosed} width={width}>

        <SidebarHeader className="title-header">
          {title}
        </SidebarHeader>

        <SidebarContent>
          <Menu iconShape="round">
            <MenuItem icon={icons.library}>
              <a href="https://omfgdogs.com/">Library</a>
            </MenuItem>
            <MenuItem icon={openCloseIcon} onClick={handleClose}>
              Minimize
            </MenuItem>
          </Menu>
        </SidebarContent>

        <SidebarFooter>
          <Menu iconShape="round">
            <MenuItem icon={icons.contact}>
              <a href="mailto:davidhaas6@gmail.com">Contact</a>
            </MenuItem>
            <MenuItem icon={icons.sourceCode}>
              <a href="https://github.com/davidhaas6/bazamjam">Source</a>
            </MenuItem>
          </Menu>
        </SidebarFooter>

      </ProSidebar>
    </div>
  );
}

export default Sidebar;