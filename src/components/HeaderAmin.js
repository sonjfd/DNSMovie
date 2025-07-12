import { signOut } from 'firebase/auth';
import { Col, Container, Dropdown, Image, Nav, Navbar,  Row } from 'react-bootstrap'
import { auth } from '../Firebase/firebase';
import {  NavLink, useNavigate } from 'react-router-dom';
import './HeaderAmin.css'

const HeaderAmin = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Đăng xuất thất bại:", error);
        }
    };
    return (
        <>
            <Navbar bg='dark' variant='dark'>
                <Navbar.Brand href='/' className='ps-4' style={{ color: "#00ADB5", fontWeight: 'bold', fontSize: '30px',textAlign:'center' }}>Trang chủ</Navbar.Brand>
                <Nav className='ms-auto'>
                    <Dropdown align="end">
                        <Dropdown.Toggle variant='dark' id='dropdown-basic'>
                            <Image src='/images/macdinh.png' roundedCircle style={{ height: '30px' }} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleLogout} className="text-danger">
                                Đăng xuất
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Navbar>
            <Container fluid className='p-0' style={{ minHeight: '100vh' }}>
                <Row noGutters>
                    <Col md={2}>

                        <div className='bg-dark ' style={{ height: "100vh", paddingTop: '50px' }}>
                            <div className='d-flex flex-column  text-white  p-3 gap-3 ' >
                                <NavLink
                                    to="/admin"
                                    className={({ isActive }) =>
                                        `text-white nav-link ${isActive ? 'active-link' : ''}`
                                    }
                                >
                                   <i className='fa-solid fa-user'></i>  Danh sách người dùng
                                </NavLink>

                                <NavLink
                                    to="/list-comment"
                                    className={({ isActive }) =>
                                        `text-white nav-link ${isActive ? 'active-link' : ''}`
                                    }
                                >
                                  <i className='fa-solid fa-comments'></i>  Danh sách comment
                                </NavLink>

                            </div>

                        </div>
                    </Col>
                 

                </Row>
            </Container>
        </>
    )
}

export default HeaderAmin
