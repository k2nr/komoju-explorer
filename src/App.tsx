import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { HostedPage } from './pages/HostedPage'
import { APIV1 } from './pages/APIV1'

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Container>
          <Row>
            <Col sm={2}>
              <Row><Link to="/hosted_page">Hosted Page</Link></Row>
              <Row><Link to="/api_v1">API v1</Link></Row>
              <Row><Link to="/multipay">MultiPay</Link></Row>
              <Row><Link to="/legacy_widget">Legacy komoju.js</Link></Row>
              <Row><Link to="/settings">Settings</Link></Row>
            </Col>
            <Col sm={8}>
              <Switch>
                <Route path="/hosted_page">
                  <HostedPage></HostedPage>
                </Route>
                <Route path="/api_v1">
                  <APIV1></APIV1>
                </Route>
              </Switch>
            </Col>
          </Row>
        </Container>
      </div>
    </Router>
  );
}

export default App;
