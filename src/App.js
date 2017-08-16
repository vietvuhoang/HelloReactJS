import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import LoginForm from './components/LoginForm';

import { Grid, Row, Col } from 'react-flexbox-grid';

class App extends Component {
    render() {
        return (
            <MuiThemeProvider>
                <Grid fluid>
                    <Row>
                        <Col xs={6} md={3}>
                            <LoginForm />
                        </Col>
                    </Row>
                </Grid>

            </MuiThemeProvider>
        );
    }
}

export default App;
