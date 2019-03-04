// @flow
import React from 'react'
import styles from './StudentQuery.css'
import universalFetch, {handleFetchError} from '../../utils/fetch'
import {Input} from 'antd'

const Search = Input.Search;

type Props = {}
type States = {
  name: string
}
class StudentQuery extends React.Component {
    props: Props;
    state: States;
    searchName: Function;
  constructor (props: Props) {
      super(props);
    this.state = {
      name: ''
    };
    this.searchName = this.searchName.bind(this)
  }

  searchName (value: string) {
    universalFetch(`${__API__}student?studentNumber=${value}`)
    .then(res => res.json())
    .then((json) => {
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'StudentQuery.js')
      }
      this.setState({
        name: json.data
      })
    })
    .catch(handleFetchError)
  }
  render () {
      const {name} = this.state;
    return <div className={styles['main']}>
      <div className={styles['search-area']}>
        <Search placeholder='请输入学号'
          onSearch={this.searchName}
        />
        <div className={styles['result']}>
          {name}
        </div>
      </div>
    </div>
  }
}

export default StudentQuery
