import { Component } from 'preact';
import { connect } from 'react-redux';
import styles from './style.module.less';
import { Route } from '../Route';
import { getRouteShapes } from '../../store/data';


export interface MenuProps {
  getRouteShapes: (routeId: string) => void,
  routes: Route[],
}

export interface MenuState {

}

export class DisconnectedMenu extends Component<MenuProps, MenuState> {
  state = {
    selectedRouteId: null,
  }

  componentDidMount = (): void => {

  }

  componentWillReceiveProps = (nextProps: MenuProps): void => {

  }

  componentWillUnmount(): void {

  }

  onRouteClicked = (e: MouseEvent) => {
    const route = this.props.routes.find(route => route.route_id === e.currentTarget.dataset['routeId'])
    if (route) {
      console.log('call getRouteShapes')
      this.props.getRouteShapes(route.route_id);
      this.setState({ selectedRouteId: route.route_id });
    }
  }

  render() {
    console.log(this.props.routes)
    return (
      <div class={styles.menu}>
        {
        this.props.routes.map(route => (
          <Route {...route} selected={this.state.selectedRouteId === route.route_id} onClick={this.onRouteClicked} />
        ))
        }
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
  getRouteShapes,
};

export const Menu = connect(mapStateToProps, mapDispatchToProps)(DisconnectedMenu);
