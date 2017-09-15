// @flow
import React from 'react'
import styles from './ClassManage.css'
import { Table, Input, Row, Col, Button, Popconfirm, Icon } from 'antd'
import universalFetch, { handleFetchError } from 'utils/fetch'

type Props = {
  data: Object
}
type States = {
  num: string,
  name: string,
  dataSource1: Array<Object>,
  dataSource2: Array<Object>,
  dataSource3: Array<Object>
}
class ClassManage extends React.Component {
  props: Props
  state: States
  constructor (props: Props) {
    super(props)
    this.state = {
      num: '',
      name: '',
      dataSource1: [],
      dataSource2: [],
      dataSource3: []
    }
    this.changeNum = this.changeNum.bind(this)
    this.changeNname = this.changeNname.bind(this)
    this.addStudent = this.addStudent.bind(this)
    this.getStudent = this.getStudent.bind(this)
    this.delStudent = this.delStudent.bind(this)
  }
  componentWillMount () {
    this.getStudent()
  }
  delStudent (item: Object) {
    universalFetch(`${__API__}student/${item.systemId}`, {
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
        ), 'ClassManage.js')
      }
      this.getStudent()
    })
    .catch(handleFetchError)
  }
  getStudent () {
    const { data } = this.props
    const delStudent = this.delStudent
    universalFetch(`${__API__}student/${data.classId}`)
    .then(res => res.json())
    .then((json) => {
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'ClassManage.js')
      }
      // const len = json.data.length
      const result1 = json.data.filter((item, index) => {
        return index % 3 === 0
      })
      const result2 = json.data.filter((item, index) => {
        return index % 3 === 1
      })
      const result3 = json.data.filter((item, index) => {
        return index % 3 === 2
      })
      this.setState({
        dataSource1: result1.map((item, index) => {
          return {
            key: index,
            num: item.studentNumber,
            name: item.name,
            operate: <Popconfirm title='确定删除该学生么？' onConfirm={function () { delStudent(item) }}
              okText='确认' cancelText='取消'>
              <span className={styles['operate']}>
                <Icon type='delete' />删除</span>
            </Popconfirm>
          }
        }),
        dataSource2: result2.map((item, index) => {
          return {
            key: index,
            num: item.studentNumber,
            name: item.name,
            operate: <Popconfirm title='确定删除该学生么？' onConfirm={function () { delStudent(item) }}
              okText='确认' cancelText='取消'>
              <span className={styles['operate']}>
                <Icon type='delete' />删除</span>
            </Popconfirm>
          }
        }),
        dataSource3: result3.map((item, index) => {
          return {
            key: index,
            num: item.studentNumber,
            name: item.name,
            operate: <Popconfirm title='确定删除该学生么？' onConfirm={function () { delStudent(item) }}
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
  changeNum (e: Object) {
    this.setState({
      num: e.target.value
    })
  }
  changeNname (e: Object) {
    this.setState({
      name: e.target.value
    })
  }
  addStudent () {
    const { data } = this.props
    const { num, name } = this.state
    if (!(num && name)) {
      return
    }
    const postData = {
      classId: data.classId,
      studentNumber: num,
      name
    }
    universalFetch(`${__API__}student`, {
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
        ), 'ClassManage.js')
      }
      this.setState({
        num: '',
        name: ''
      })
      this.getStudent()
    })
    .catch(handleFetchError)
  }
  render () {
    const columns = [{
      title: '学号',
      dataIndex: 'num',
      key: 'num'
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate'
    }]
    const { num, name, dataSource1, dataSource2, dataSource3 } = this.state
    return <div className={styles['main']}>
      <div className={styles['class-select']}>
        <Row>
          <Col span={7}>
            <Table columns={columns} pagination={false} dataSource={dataSource1} />
          </Col>
          <Col span={1} />
          <Col span={7}>
            <Table columns={columns} pagination={false} dataSource={dataSource2} />
          </Col>
          <Col span={1} />
          <Col span={7}>
            <Table columns={columns} pagination={false} dataSource={dataSource3} />
          </Col>
        </Row>
      </div>
      <div className={styles['add-member']}>
        <Row>
          <Col span={8}>
            <Input value={num} placeholder='学号' style={{ width: '200px' }} onChange={this.changeNum} />
          </Col>
          <Col span={8}>
            <Input value={name} placeholder='姓名' style={{ width: '200px' }} onChange={this.changeNname} />
          </Col>
          <Col span={8}>
            <Button type='primary' onClick={this.addStudent} disabled={!num && !name}>添加</Button>
          </Col>
        </Row>
      </div>
    </div>
  }
}
export default ClassManage
