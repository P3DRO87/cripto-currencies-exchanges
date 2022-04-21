import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import { CoinProvider } from "./context/CoinContext";
import CoinDetail from "./pages/CoinDetail";
import Home from "./pages/Home";

const App = () => {
   return (
      <Router>
         <CoinProvider>
            <Header />
            <main>
               <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/coin/:id" component={CoinDetail} />
               </Switch>
            </main>
         </CoinProvider>
      </Router>
   );
};

export default App;
