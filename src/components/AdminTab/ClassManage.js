// @flow
import React from 'react'
import styles from './ClassManage.css'
import { Table, Icon, Input, Select, Row, Col, Button, Popconfirm } from 'antd'
import universalFetch, { handleFetchError } from '../../utils/fetch'
const Option = Select.Option

type Props = {
  data: Object
}
type States = {
  name: string,
  specialty: string,
  grade: string,
  showTable: boolean,
  specialtyList: Array<Object>,
  gradeList: Array<string>,
  dataSource: Array<Object>
}
class ClassManage extends React.Component {
  props: Props
  state: States
  constructor (props: Props) {
    super(props)
    this.state = {
      name: '',
      specialty: '',
      grade: '',
      showTable: false,
      specialtyList: [],
      gradeList: [],
      dataSource: []
    }
  }
  componentWillMount () {
    this.getSpecialty()
    this.getGrade()
  }
  addClass = () => {
    const { name, specialty, grade } = this.state
    if (!name) {
      return
    }
    const postData = {
      specialtyId: specialty,
      grade,
      name
    }
    universalFetch(`${__API__}class`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'ClassManage.js')
      }
      this.setState({
        name: ''
      })
      this.queryClass()
    })
    .catch(handleFetchError)
  }
  delClass = (item: Object) => {
    universalFetch(`${__API__}class/${item.systemId}`, {
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
      this.queryClass()
    })
    .catch(handleFetchError)
  }
  getGrade = () => {
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
        ), 'ClassManage.js')
      }
      this.setState({
        gradeList: json.data
      })
    })
    .catch(handleFetchError)
  }
  getSpecialty = () => {
    const { data } = this.props
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
        ), 'ClassManage.js')
      }
      this.setState({
        specialtyList: json.data
      })
    })
    .catch(handleFetchError)
  }
  queryClass = () => {
    const delClass = this.delClass
    const { specialty, grade } = this.state
    universalFetch(`${__API__}class?specialtyId=${specialty}&grade=${grade}`)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'ClassManage.js')
      }
      this.setState({
        showTable: true,
        dataSource: json.data.map((item, index) => {
          return {
            key: index,
            num: index + 1,
            name: item.name,
            operate: <Popconfirm title='确定删除该班级么？' onConfirm={function () { delClass(item) }}
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
  changeSpecialty = (value: string) => {
    this.setState({
      specialty: value
    })
  }
  changeGrade = (value: string) => {
    this.setState({
      grade: value
    })
  }
  changeName = (e: Object) => {
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
      title: '班级名称',
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
      name: <Input style={{ width: '300px' }} placeholder='新添加班级名称'
        value={this.state.name} onChange={this.changeName} />,
      operate: <span className={styles['operate']} onClick={this.addClass}>
        <Icon type='plus-circle-o' />添加</span>
    }]
    const { specialty, grade, showTable, specialtyList, gradeList, dataSource } = this.state
    return <div className={styles['main']}>
      <div className={styles['class-select']}>
        <Row>
          <Col span={8}>
            <Select style={{ width: 250 }} onChange={this.changeSpecialty} placeholder='请选择专业'>
              {
                specialtyList.map((item, index) => {
                  return <Option value={item.systemId.toString()} key={index}>{item.name}</Option>
                })
              }
            </Select>
          </Col>
          <Col span={8}>
            <Select style={{ width: 250 }} onChange={this.changeGrade} placeholder='请选择年级'>
              {
                gradeList.map((item, index) => {
                  return <Option value={item} key={index}>{item}</Option>
                })
              }
            </Select>
          </Col>
          <Col span={8}>
            <Button type='primary' onClick={this.queryClass} disabled={!(specialty && grade)}>
              确定
            </Button>
          </Col>
        </Row>
      </div>
      {
        showTable
        ? <div className={styles['table']}>
          <Table columns={columns} pagination={false} dataSource={baseSource.concat(dataSource)} />
        </div>
        : ''
      }
    </div>
  }
}
export default ClassManage
