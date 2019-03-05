// @flow
import type { Store } from 'redux'
import { combineReducers } from 'redux'
import location from './location'
import counter from './modules/counter'
import githubRepos from './modules/githubRepos'
import { storeHelper } from './createStore'

type AsyncReducers = { [key: string]: any }
type AsyncReducer = { key: string, reducer: any }
export type Action = { type: string, payload?: any }

export const makeRootReducer = (asyncReducers: AsyncReducers = {}) => {
  return combineReducers({
    location,
    counter,
    githubRepos,
    ...asyncReducers
  })
}

export const injectReducer = (store: Store<*, *>, { key, reducer }: AsyncReducer) => {
  if (Object.hasOwnProperty.call(storeHelper.asyncReducers, key)) return

<<<<<<< HEAD
    storeHelper.asyncReducers[key] = reducer
=======
  storeHelper.asyncReducers[key] = reducer
>>>>>>> cc437f57c50c25fc3764f451d6791fc7c92cd38e
  store.replaceReducer(makeRootReducer(storeHelper.asyncReducers))
}

export default makeRootReducer
