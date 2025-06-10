import { BrowserRouter as Router , Routes, Route, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.css';
import ListComponent from './components/product/list.component';
import CreateComponent from './components/product/create.component';
import EditComponent from './components/product/edit.component';
import AboutComponent from './components/about/index.component';

function App() {
  return (
    <Router>
      <Navbar bg="primary">
        <Container>
          <Navbar.Brand>
            <Link to={"/"} className="navbar-brand text-white">
              My Inventory
            </Link>
          </Navbar.Brand>
          <Nav>
            <Nav>
              <Link to={"/"} className="navbar-brand text-white">
                Home
              </Link>
            </Nav>
            <Nav>
              <Link to={"/about"} className="navbar-brand text-white">
                About
              </Link>
            </Nav>
          </Nav>
        </Container>
      </Navbar>

      <main className="flex-shrink-0">
        <Container className="mt-5">
          <Row>
            <Col lg={12}>
              <Routes>
                <Route path='/product/create' element={<CreateComponent />} />
                <Route path='/product/edit/:id' element={<EditComponent />} />
                <Route path='/' element={<ListComponent />} />
                <Route path='/about' element={<AboutComponent />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </main>
      <footer className="footer navbar fixed-bottom mt-auto py-3 bg-light">
        <div className="container">
          <span className="text-muted">Place sticky footer content here.</span>
        </div>
      </footer>
    </Router>
  );
}

export default App;
