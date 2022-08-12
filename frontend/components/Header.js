import { Nav, Navbar, Container } from "react-bootstrap";
import { isEmpty } from "lodash";
import Link from "next/link";
import styled from "styled-components";
import Button from "../components/Button";

const StyledSubmenu = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
`;

const Header = ({ brand, submenu }) => {
  return (
    <>
      <Navbar sticky="top" bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>{brand}</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="w-100">
              <Link href="/kniznice">
                <Nav.Link as="div" style={{ cursor: "pointer" }}>
                  Kniznice
                </Nav.Link>
              </Link>
              <Link href="/studenti">
                <Nav.Link as="div" style={{ cursor: "pointer" }}>
                  Studenti
                </Nav.Link>
              </Link>
              <StyledSubmenu>
                {!isEmpty(submenu) &&
                  submenu?.map((item) => (
                    <Button
                      className="mx-3"
                      variant={item?.color}
                      onClick={item?.func}
                      href={item?.href}
                    >
                      {item?.name}
                    </Button>
                  ))}
              </StyledSubmenu>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
