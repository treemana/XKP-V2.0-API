// @flow
import React from 'react'
import styles from './AdminManage.css'
import { Table, Icon, Input, Select, Row, Col, Button, Popconfirm, Modal } from 'antd'
import universalFetch, { handleFetchError } from 'utils/fetch'
const Option = Select.Option

type Props = {
  data: Object
}
type States = {
  name: String,
  specialty: String,
  classes: String,
  acatemy: String,
  grade: String,
  acatemyList: Array<Object>,
  specialtyList: Array<Object>,
  classList: Array<Object>,
  gradeList: Array<String>,
  adminList: Array<Object>,
  visible: boolean,
  initPwd: String,
  userName: String,
  showTable: boolean
}
class AdminManage extends React.Component {
  props: Props
  state: States
  constructor (props: Props) {
    super(props)
    this.state = {
      name: '',
      specialty: '',
      classes: '',
      acatemy: '',
      grade: '',
      acatemyList: [],
      specialtyList: [],
      classList: [],
      gradeList: [],
      adminList: [],
      visible: false,
      initPwd: '',
      userName: '',
      showTable: false
    }
    this.changeName = this.changeName.bind(this)
    this.changeAcatemy = this.changeAcatemy.bind(this)
    this.changeSpecialty = this.changeSpecialty.bind(this)
    this.changeClass = this.changeClass.bind(this)
    this.changeGrade = this.changeGrade.bind(this)
    this.queryAdmin = this.queryAdmin.bind(this)
    this.getAcatemy = this.getAcatemy.bind(this)
    this.addAdmin = this.addAdmin.bind(this)
    this.delAdmin = this.delAdmin.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.resetPwd = this.resetPwd.bind(this)
  }
  resetPwd (item: Object) {
    universalFetch(`${__API__}manager/reset/${item.systemId}`, {
      method: 'PUT',
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
        ), 'AdminManage.js')
      }
      this.setState({
        visible: true,
        userName: json.data.username,
        initPwd: json.data.password
      })
      this.queryAdmin()
    })
    .catch(handleFetchError)
  }
  handleOk () {
    this.setState({
      visible: false
    })
  }
  componentWillMount () {
    this.getAcatemy()
  }
  delAdmin (item: Object) {
    universalFetch(`${__API__}manager/${item.systemId}`, {
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
        ), 'AdminManage.js')
      }
      this.queryAdmin()
    })
    .catch(handleFetchError)
  }
  addAdmin () {
    const { name, specialty, classes, acatemy, grade } = this.state
    if (!name) {
      return
    }
    const data = {
      username: name,
      academyId: acatemy,
      specialtyId: specialty,
      classId: classes,
      type: 'C',
      grade
    }
    universalFetch(`${__API__}manager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
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
        ), 'AdminManage.js')
      }
      this.setState({
        visible: true,
        name: '',
        userName: json.data.username,
        initPwd: json.data.password
      })
      this.queryAdmin()
    })
    .catch(handleFetchError)
  }
  getAcatemy () {
    const { data } = this.props
    console.log(data)
    if (data.academyId) {
      universalFetch(`${__API__}academy/${data.academyId}`)
      .then(res => res.json())
      .then((json) => {
        console.log(json)
        if (json.code !== 0) {
          throw new Error(JSON.stringify(
            {
              code: json.code,
              message: json.message
            }
          ), 'AdminManage.js')
        }
        this.setState({
          acatemyList: [{
            systemId: data.academyId,
            name: json.data
          }]
        })
      })
      .catch(handleFetchError)
    } else {
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
          ), 'AdminManage.js')
        }
        this.setState({
          acatemyList: json.data
        })
      })
      .catch(handleFetchError)
    }
  }
  queryAdmin () {
    const delAdmin = this.delAdmin
    const resetPwd = this.resetPwd
    const { specialty, classes, acatemy, grade } = this.state
    let url = `${__API__}manager?academyId=${acatemy}&`
    if (specialty) {
      url = url + `specialtyId=${specialty}&`
    }
    if (grade) {
      url = url + `grade=${grade}&`
    }
    if (classes) {
      url = url + `classId=${classes}`
    }
    universalFetch(url)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'AdminManage.js')
      }
      this.setState({
        showTable: true,
        adminList: json.data.map((item, index) => {
          return {
            key: index,
            num: index + 1,
            name: item.username,
            operate: <span>
              <Popconfirm title='确定重置密码么？' onConfirm={function () { resetPwd(item) }}
                okText='确认' cancelText='取消'>
                <span className={styles['operate']}>
                  <Icon type='reload' />重置密码</span>
              </Popconfirm>
              <Popconfirm title='确定删除该管理员么？' onConfirm={function () { delAdmin(item) }}
                okText='确认' cancelText='取消'>
                <span className={styles['operate']} style={{ marginLeft: '15px' }}>
                  <Icon type='delete' />删除</span>
              </Popconfirm>
            </span>
          }
        })
      })
    })
    .catch(handleFetchError)
  }
  changeAcatemy (value: String) {
    this.setState({
      acatemy: value
    })
    universalFetch(`${__API__}specialty/${value}`)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'AdminManage.js')
      }
      this.setState({
        specialtyList: json.data
      })
    })
    .catch(handleFetchError)
  }
  changeSpecialty (value: String) {
    this.setState({
      specialty: value
    })
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
        ), 'AdminManage.js')
      }
      this.setState({
        gradeList: json.data
      })
    })
    .catch(handleFetchError)
  }
  changeClass (value: String) {
    this.setState({
      classes: value
    })
  }
  changeGrade (value: String) {
    const { specialty } = this.state
    this.setState({
      grade: value
    })
    universalFetch(`${__API__}class?specialtyId=${specialty}&grade=${value}`)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'AdminManage.js')
      }
      this.setState({
        classList: json.data
      })
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
      title: '管理员',
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
      name: <Input style={{ width: '300px' }} placeholder='新添加管理员' onChange={this.changeName}
        value={this.state.name} />,
      operate: <span className={styles['operate']} onClick={this.addAdmin}>
        <Icon type='plus-circle-o' />添加</span>
    }]
    const { specialty, acatemy, grade, acatemyList, specialtyList, classList,
      gradeList, showTable } = this.state
    return <div className={styles['main']}>
      <div className={styles['class-select']}>
        <Row>
          <Col span={5}>
            <Select style={{ width: 150 }} onChange={this.changeAcatemy} placeholder='请选择学院'>
              {
                acatemyList.map((item, index) => {
                  return <Option value={item.systemId.toString()} key={index}>{item.name}</Option>
                })
              }
            </Select>
          </Col>
          <Col span={5}>
            <Select style={{ width: 150 }} onChange={this.changeSpecialty}
              placeholder='请选择专业' disabled={!acatemy}>
              {
                specialtyList.map((item, index) => {
                  return <Option value={item.systemId.toString()} key={index}>{item.name}</Option>
                })
              }
            </Select>
          </Col>
          <Col span={5}>
            <Select style={{ width: 150 }} onChange={this.changeGrade}
              placeholder='请选择年级' disabled={!(specialty && acatemy)}>
              {
                gradeList.map((item, index) => {
                  return <Option value={item} key={index}>{item}</Option>
                })
              }
            </Select>
          </Col>
          <Col span={5}>
            <Select style={{ width: 150 }} onChange={this.changeClass}
              placeholder='请选择班级' disabled={!(acatemy && specialty && grade)}>
              {
                classList.map((item, index) => {
                  return <Option value={item.systemId.toString()} key={index}>{item.name}</Option>
                })
              }
            </Select>
          </Col>
          <Col span={4}>
            <Button type='primary' onClick={this.queryAdmin} disabled={!(acatemy)}>
              确定
            </Button>
          </Col>
        </Row>
      </div>
      {
        showTable
        ? <div className={styles['table']}>
          <Table columns={columns} pagination={false} dataSource={baseSource.concat(this.state.adminList)} />
        </div>
        : ''
      }
      <Modal
        title=''
        closable={false}
        maskClosable={false}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleOk}
        width={400}
        okText='确认'
      >
        <p className={styles['modal-text']}>用户名：{this.state.userName}</p>
        <p className={styles['modal-text']}>初始密码：{this.state.initPwd}</p>
      </Modal>
    </div>
  }
}
export default AdminManage
