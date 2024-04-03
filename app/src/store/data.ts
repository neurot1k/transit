import { produce } from 'immer';
import type { AppDispatch } from '.';


// Action Types
const SET_ROUTES = 'SET_ROUTES';
const SET_ROUTE_SHAPES = 'SET_ROUTE_SHAPES';

// Action Creators
export const setRoutes = (routes: Route[]) => ({
  type: SET_ROUTES,
  payload: { routes },
});

export const setRouteShapes = (shapes) => ({
  type: SET_ROUTE_SHAPES,
  payload: { shapes },
});

// Aync Actions
export const fetchRoutes = () => async (dispatch: AppDispatch, getState) => {
  const response = await fetch('/api/routes/')
  console.log({ response })
  const data = await response.json();
  dispatch(setRoutes(data.routes));
}

export const getRouteShapes = (routeId: string) => async (dispatch: AppDispatch) => {
  const response = await fetch(`/api/routes/${routeId}/shapes/`);
  const shapes = await response.json();
  console.log({ shapes })
  dispatch(setRouteShapes(shapes));
}

// Reducer

const initialState = {
  routes: [],
  shapes: [],
};

export default produce((draftState, action) => {
  console.log({ action })
  switch (action.type) {
    case SET_ROUTES: {
      const { routes } = action.payload;
      draftState.routes = routes;
      return;
    }
    case SET_ROUTE_SHAPES: {
      const { shapes } = action.payload;
      draftState.shapes = shapes;
      return;
    }
  }
}, initialState);