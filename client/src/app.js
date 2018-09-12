import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import API from './api';
import Home from './pages/home';
import DatePage from './pages/date';
import UserPage from './pages/user';
import TimelineStore from './stores/timeline_store';
import AppStore from './stores/app_store';

const appConfig = {
  endpoint: process.env.REACT_APP_API_ENDPOINT
}

const createStores = (appConfig) => {
  const api = new API(appConfig.endpoint);
  return {
    timelineStore: new TimelineStore(api),
    appStore: new AppStore(appConfig)
  }
}

const App = () => {
  const stores = createStores(appConfig);
  return (
    <Provider {...stores}>
      <BrowserRouter>
        <div>
          <Route exact path='/' component={Home} />
          <Route path='/date/:date' component={DatePage} />
          <Route path='/user/:userid/:date' component={UserPage} />
          <Route path='/user/:userid' component={UserPage} />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
