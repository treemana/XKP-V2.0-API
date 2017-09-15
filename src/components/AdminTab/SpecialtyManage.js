// @flow
import React from 'react'
import styles from './SpecialtyManage.css'
import { Table, Icon, Input, Popconfirm } from 'antd'
import universalFetch, { handleFetchError } from 'utils/fetch'

type Props = {
  data: Object
}
type States = {
  name: string,
  dataSource: Array<Object>
}
class SpecialtyManage extends React.Component {
  props: Props
  state: States
  constructor (props: Props) {
    super(props)
    this.state = {
      name: '',
      dataSource: []
    }
    this.changeName = this.changeName.bind(this)
    this.addSpeciaty = this.addSpeciaty.bind(this)
    this.getSpeciaty = this.getSpeciaty.bind(this)
    this.delSpeciaty = this.delSpeciaty.bind(this)
  }
  delSpeciaty (item: Object) {
    universalFetch(`${__API__}specialty/${item.systemId}`, {
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
        ), 'SpecialtyManage.js')
      }
      this.getSpeciaty()
    })
    .catch(handleFetchError)
  }
  getSpeciaty () {
    const { data } = this.props
    const delSpeciaty = this.delSpeciaty
    universalFetch(`${__API__}specialty/${data.academyId}`)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'SpecialtyManage.js')
      }
      this.setState({
        dataSource: json.data.map((item, index) => {
          return {
            key: index,
            num: index + 1,
            name: item.name,
            operate: <Popconfirm title='确定删除该专业么？' onConfirm={function () { delSpeciaty(item) }}
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
  componentWillMount () {
    this.getSpeciaty()
  }
  addSpeciaty () {
    const { data } = this.props
    const { name } = this.state
    const postData = {
      academyId: data.academyId,
      name
    }
    if (!name) {
      return
    }
    universalFetch(`${__API__}specialty`, {
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
        ), 'AcatemyManage.js')
      }
      this.setState({
        name: ''
      })
      this.getSpeciaty()
    })
    .catch(handleFetchError)
  }
  changeName (e: Object) {
    this.setState({
      name: e.target.value
    })
  }
  render () {
    const columns = [{
      title: '序号',
      dataIndex: 'num',
      key: 'num',
      width: '25%'
    }, {
      title: '专业名称',
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
      name: <Input style={{ width: '300px' }} placeholder='新添加专业名称'
        value={this.state.name} onChange={this.changeName} />,
      operate: <span className={styles['operate']} onClick={this.addSpeciaty}><Icon type='plus-circle-o' />添加</span>
    }]
    const { dataSource } = this.state
    return <div className={styles['main']}>
      <Table columns={columns} pagination={false} dataSource={baseSource.concat(dataSource)} />
    </div>
  }
}
export default SpecialtyManage
