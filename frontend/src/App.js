import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { SearchProvider } from './utils/SearchContext'
import Search from "./pages/Search";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import NotFound from "./pages/NotFound";
import CoursePage from "./pages/CoursePage";


const App = () => {
  return (
    <SearchProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/search' component={Search} />
          <Route exact path='/courses/:code' component={CoursePage} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </Router>
    </SearchProvider>
  )
}

export default App;
