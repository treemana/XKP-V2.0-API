// @flow
import React from 'react'
import styles from './DataManage.css'
import { Table, Icon, Input, Button, Spin, message, Popconfirm } from 'antd'
import universalFetch, { handleFetchError } from 'utils/fetch'

type States = {
  grade: String,
  loading: boolean,
  dataSource: Array<Object>
}
class DataManage extends React.Component {
  state: States
  constructor () {
    super()
    this.state = {
      grade: '',
      loading: false,
      dataSource: []
    }
    this.changeGrade = this.changeGrade.bind(this)
    this.startTerm = this.startTerm.bind(this)
    this.getGrade = this.getGrade.bind(this)
    this.delGrade = this.delGrade.bind(this)
    this.addGrade = this.addGrade.bind(this)
  }
  componentWillMount () {
    this.getGrade()
  }
  addGrade () {
    const { grade } = this.state
    const postData = {
      grade
    }
    universalFetch(`${__API__}grade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    .then(res => res.json())
    .then((json) => {
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'DataManage.js')
      }
      this.setState({
        grade: ''
      })
      this.getGrade()
    })
    .catch(handleFetchError)
  }
  delGrade (item: Object) {
    universalFetch(`${__API__}grade/${item}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then((json) => {
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'DataManage.js')
      }
      this.getGrade()
    })
    .catch(handleFetchError)
  }
  startTerm () {
    this.setState({
      loading: true
    })
    universalFetch(`${__API__}data`)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'DataManage.js')
      }
      this.setState({
        loading: false
      })
      message.success('成功')
    })
    .catch(handleFetchError)
  }
  getGrade () {
    const delGrade = this.delGrade
    universalFetch(`${__API__}grade`)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'DataManage.js')
      }
      this.setState({
        dataSource: json.data.map((item, index) => {
          return {
            key: index,
            grade: item,
            operate: <Popconfirm title='确定删除该年级么？' onConfirm={function () { delGrade(item) }}
              okText='确认' cancelText='取消'>
              <span className={styles['operate']}>
                <Icon type='delete' />删除</span>
            </Popconfirm>
          }
        })
      })
    })
    .catch(handleFetchError)
  }
  changeGrade (e: Object) {
    this.setState({
      grade: e.target.value
    })
  }
  render () {
    const columns = [{
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
      width: '50%'
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: '50%'
    }]
    const baseSource = [{
      key: 999999,
      grade: <Input style={{ width: '300px' }} placeholder='新添加年级'
        value={this.state.grade} onChange={this.changeGrade} />,
      operate: <span className={styles['operate']} onClick={this.addGrade}><Icon type='plus-circle-o' />添加</span>
    }]
    const { loading, dataSource } = this.state
    return <div className={styles['main']}>
      <div className={styles['start']}>
        <Spin tip='Loading...' size='large' spinning={loading}>
          <Button type='primary' size='large' style={{ width: '200px' }} onClick={this.startTerm}>
            开启新学期
          </Button>
        </Spin>
      </div>
      <Table columns={columns} pagination={false} dataSource={baseSource.concat(dataSource)} />
    </div>
  }
}
export default DataManage
