import { FunctionComponent } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

interface ITopBarProps {
    // fill drop down components from App?
}

type LinkFormat = string[][];

const TopBar: FunctionComponent<ITopBarProps> = (props: ITopBarProps) => {
    let dropDowns = [
        ["Library", "http://www.omfgdogs.com/#"]
    ].map(([title, url]) => 
         <Nav.Link href={url}>{title}</Nav.Link>
    );

    return (
        <Navbar bg="light" expand="lg" className="topBar">
            <Container>
                <Navbar.Brand href="#home">Bazamjam</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    {dropDowns}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default TopBar;