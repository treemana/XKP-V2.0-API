import asyncRoute from '../asyncRoute'

export default asyncRoute.bind(null, () => import(
  './components/LoginContainer'
))
