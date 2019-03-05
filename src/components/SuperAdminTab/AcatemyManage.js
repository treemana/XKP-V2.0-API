// @flow
import React from 'react'
import styles from './AcatemyManage.css'
import { Icon, Input, Popconfirm, Table } from 'antd'
import universalFetch, { handleFetchError } from '../../utils/fetch'

type States = {
  name: string,
  dataSource: Array<Object>
}
class AcatemyManage extends React.Component {
  state: States;
  constructor () {
    super()
    this.state = {
      name: '',
      dataSource: []
    }
  }
  delAcatemy = (item: Object) => {
    universalFetch(`${__API__}academy/${item.systemId}`, {
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
        ), 'AcatemyManage.js')
      }
      this.getAcatemy()
    })
    .catch(handleFetchError)
  };
  getAcatemy = () => {
    const delAcatemy = this.delAcatemy
    universalFetch(`${__API__}academy`)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'AcatemyManage.js')
      }
      this.setState({
        dataSource: json.data.map((item, index) => {
          return {
            key: index,
            num: index + 1,
            name: item.name,
            operate: <Popconfirm title='确定删除该学院么？' onConfirm={function () { delAcatemy(item) }}
              okText='确认' cancelText='取消'>
              <span className={styles['operate']}>
                <Icon type='delete' />删除</span>
            </Popconfirm>
          }
        })
      })
    })
    .catch(handleFetchError)
  };
  componentWillMount () {
    this.getAcatemy()
  }
  addAcatemy = () => {
    const { name } = this.state
    const data = {
      name
    }
    universalFetch(`${__API__}academy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((json) => {
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'AcatemyManage.js')
      }
      this.setState({
        name: ''
      })
      this.getAcatemy()
    })
    .catch(handleFetchError)
  };
  changeName = (e: Object) => {
    this.setState({
      name: e.target.value
    })
  };
  render () {
    const columns = [{
      title: '序号',
      dataIndex: 'num',
      key: 'num',
      width: '25%'
    }, {
      title: '学院名称',
      dataIndex: 'name',
      key: 'name',
      width: '50%'
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: '25%'
    }]
    const baseSource = [{
      key: 999999,
      num: 0,
      name: <Input style={{ width: '300px' }} placeholder='新添加学院名称'
        value={this.state.name} onChange={this.changeName} />,
      operate: <span className={styles['operate']} onClick={this.addAcatemy}><Icon type='plus-circle-o' />添加</span>
    }]
    const { dataSource } = this.state
    return <div className={styles['main']}>
      <Table columns={columns} pagination={false} dataSource={baseSource.concat(dataSource)} />
    </div>
  }
}
export default AcatemyManage
