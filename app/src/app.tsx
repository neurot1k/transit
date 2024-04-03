import { Component } from 'preact';
import { connect } from 'react-redux';
import './style/app.less';
import type { RootState } from './store';
import { fetchRoutes } from './store/data';
import type { Route } from './store/data';
import { Map } from './components/Map';
import { Menu } from './components/Menu';

export interface AppProps {
  fetchRoutes: typeof fetchRoutes,
  routes: Route[],
}

export class DisconnectedApp extends Component<AppProps> {
  componentWillMount(): void {
    this.props.fetchRoutes();
  }

  render() {
    return (
      <>
        <Menu routes={this.props.routes} />
        <Map />
      </>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  routes: state.data.routes,
})

const mapDispatchToProps = {
  fetchRoutes,
};

export const App = connect(mapStateToProps, mapDispatchToProps)(DisconnectedApp);