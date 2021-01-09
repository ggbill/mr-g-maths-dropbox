import React from 'react'
import { Router, Route, Switch } from "react-router-dom"
import Home from './components/home/Home'
import HttpsRedirect from 'react-https-redirect'
import ReactGA from'react-ga'
import { createBrowserHistory } from 'history';
// import DynamicComponent from './components/dynamicComponent/DynamicComponent'
// import MenuBar from './components/shared/MenuBar'
import Footer from './components/shared/Footer';
import About from './components/about/About';
// import ResourcePage from './components/resource/ResourceComponent'

const history = createBrowserHistory();

ReactGA.initialize('UA-165948277-1');


history.listen((location) => {
    ReactGA.set({ page: location.pathname + location.search })
    ReactGA.pageview(location.pathname + location.search)
});

const App = () => {

    return (
        <HttpsRedirect>
            <Router history={history}>
                {/* <MenuBar /> */}
                {/* <div className="full-height-content"> */}
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/about" component={About} exact />
                        {/* <Route path="/resource/:fileName" component={ResourcePage} /> */}
                        {/* <Route path="/:dynamicPath" component={DynamicComponent} /> */}
                    </Switch>
                {/* </div> */}
                {/* <Footer /> */}
            </Router>
        </HttpsRedirect>
    );
}

export default App;
