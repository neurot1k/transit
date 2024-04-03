import styles from './style.module.less';
import clsx from 'clsx';

export interface Route {
  route_id: string,
  route_short_name: string,
  route_long_name: string,
  route_type: string,
  route_color: string,
  route_text_color: string,
  selected: boolean,
  onClick: (e: MouseEvent) => void,
}

export const Route = ({ route_id, route_short_name, route_long_name, route_color, route_text_color, selected, onClick }: Route) => {
  const style = {
    color: route_text_color ? `#${route_text_color}` : '#000000',
    background: route_color ? `#${route_color}` : '#ffffff',
  }

  return (
    <div class={clsx(styles.route, { [styles.selected]: selected })} key={route_id} data-route-id={route_id} onClick={onClick}>
      <div class={styles.shortName} style={style}>{route_short_name}</div>
      <div class={styles.longName}>{route_long_name}</div>
    </div>
  )
}