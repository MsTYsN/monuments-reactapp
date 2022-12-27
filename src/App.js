import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Home } from './views/Home';
import { MonumentDetails } from './views/MonumentDetails';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons

function App() {
  return (
    <BrowserRouter>
      <header>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>Accueil</Navbar.Brand>
            </LinkContainer>
          </Container>
        </Navbar>
      </header>
      <main style={{ minHeight: '800px' }}>
        <Container className="mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/monument/:id" element={<MonumentDetails />} />
          </Routes>
        </Container>
      </main>
      <footer
        className="bg-dark text-center text-white"
        style={{ fontSize: '18px', padding: '20px' }}
      ></footer>
    </BrowserRouter>
  );
}

export default App;
