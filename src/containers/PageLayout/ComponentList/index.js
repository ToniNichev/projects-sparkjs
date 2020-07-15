import Loadable from 'react-loadable';
import Loading from '../../../components/Loading';
/* system components */
const System = Loadable({
  loader: () => import ('../../../components/System'),
  loading: Loading
});
/* Components */
const Header = Loadable({
  loader: () => import ('../../../components/Header'),
  loading: Loading
});
const Home = Loadable({
  loader: () => import ('../../../components/Home'),
  loading: Loading
});
const About = Loadable({
  loader: () => import ('../../../components/About'),
  loading: Loading
});
const Greetings = Loadable({
  loader: () => import ('../../../components/Greetings'),
  loading: Loading
});
export default {
  System,
  Home,
  About,
  Greetings,
  Header
}
