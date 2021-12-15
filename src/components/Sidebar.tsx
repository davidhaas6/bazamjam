import { FunctionComponent, useState } from "react";
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

import 'react-pro-sidebar/dist/css/styles.css';
import { TiPencil } from 'react-icons/ti';
import { GiAudioCassette } from 'react-icons/gi';
import { BiCodeCurly, BiArrowFromRight, BiArrowFromLeft } from 'react-icons/bi';
import { BsGear } from 'react-icons/bs';
import { MdAccountCircle, } from 'react-icons/md';
import { RiDoorClosedLine, RiDoorLockLine, RiDoorOpenLine } from 'react-icons/ri';
import { CgSmileMouthOpen } from 'react-icons/cg';


const icons = {
    menuClosed: <BiArrowFromLeft />,
    menuOpen: <BiArrowFromRight />,
    library: <GiAudioCassette />,
    settings: <BsGear />,
    sourceCode: <BiCodeCurly />,
    contact: <TiPencil />,
    login: <RiDoorClosedLine />,
    logout: <RiDoorClosedLine />,
    midimouth: <CgSmileMouthOpen />,
};

interface ISidebarProps {
    isMobile?: boolean;
}

const Sidebar: FunctionComponent<ISidebarProps> = (props: ISidebarProps) => {
    const [isClosed, setIsClosed] = useState(props.isMobile == true);    // if it's mobile, start closed
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

    // display properties
    let title = isClosed ? "BzJ" : "BazamJam";
    let width = props.isMobile ? "20px" : "175px";
    let openCloseIcon = isClosed ? icons.menuClosed : icons.menuOpen;

    // functions
    let handleClose = () => setIsClosed(!isClosed);
    let onLibaryClick = isAuthenticated ? () => { } : loginWithRedirect;
    let onSettingsClick = isAuthenticated ? () => { } : loginWithRedirect;


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



                        <MenuItem icon={icons.library} onClick={() => onLibaryClick()}>
                            {isAuthenticated ? <a href="https://omfgdogs.com/">Library</a> : "Library"}
                        </MenuItem>


                        <MenuItem icon={icons.midimouth}>
                            <Link to="/midi-mouth">MidiMouth</Link>
                        </MenuItem>

                        {!isAuthenticated &&
                            <MenuItem icon={icons.login} onClick={() => loginWithRedirect()}>
                                Sign in
                            </MenuItem>
                        }

                        {isAuthenticated &&
                            <MenuItem icon={icons.settings} onClick={() => onSettingsClick()}>
                                <a href="https://omfgdogs.com/">Settings</a>
                            </MenuItem>
                        }

                        <MenuItem icon={openCloseIcon} onClick={handleClose}>
                            Minimize
                        </MenuItem>

                    </Menu>
                </SidebarContent>

                <SidebarFooter>
                    <Menu iconShape="round">
                        {isAuthenticated &&
                            <MenuItem icon={icons.logout} onClick={() => logout({ returnTo: window.location.origin })}>
                                Log out
                            </MenuItem>
                        }
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