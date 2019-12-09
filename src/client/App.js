import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import './App.css';

const App = ({ routes, initialData }) => {
  return routes
    ? <div className="App">
      <Switch>
        {routes.map((route, index) => {
          // pass in the initialData from the server or window.DATA for this
          // specific route
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              render={props =>
                React.createElement(route.component, {
                  ...props,
                  initialData: initialData[index] || null,
                })}
            />
          );
        })}
      </Switch>
    </div>
    : null;
};

export default App;
