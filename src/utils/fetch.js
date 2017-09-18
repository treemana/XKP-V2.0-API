/**
 * 在这里处理response status code
 */

import fetch from 'isomorphic-fetch'
import { notification } from 'antd'
import merge from 'lodash.merge'
type Params = {
  path: string,
  options: Object
}

type Store = {
  dispatch: () => void,
  getState: () => Object
}

function setParams (params: Params, store?: Store) {
  return Promise.resolve(params)
}

function handleFetch ({ path, options }: Params) {
  return fetch(path, options)
}

export function handleFetchError (e: Error, title: string = '请求异常') {
  const ErrMessage = e ? (e.message ? e.message : e) : e
  let errInfo
  let MatchErr = false
  try {
    // $FlowFixMe
    errInfo = JSON.parse(ErrMessage)
    MatchErr = true
  } catch (e) {
    errInfo = ErrMessage
    MatchErr = false
  }
  console.error(errInfo)
  if (MatchErr && (errInfo.code === 2)) {
    localStorage.setItem('token', '')
    const origin = window.location.origin
    window.location.href = origin
  }
  notification['error']({
    message: title,
    // $FlowFixMe
    description: errInfo.message
  })
}

function isResError ({ status }: Object) {
  return status >= 400
}

function handleResponseStatus (response) {
  console.log('response status:', response.status)
  if (isResError(response)) {
    // TODO: handle http error
  }

  return response
}

export function universalFetch (path: string, options: Object = {}, store?: Store) {
  const token = localStorage.getItem('token')
  const headerOptions = merge(options, {
    headers: {
      'token': token
    }
  })
  const params = { path, options: headerOptions }

  return setParams(params, store)
    .then(handleFetch)
    .then(handleResponseStatus)
}

export default universalFetch
