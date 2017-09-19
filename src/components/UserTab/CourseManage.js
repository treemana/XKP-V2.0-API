// @flow
import React from 'react'
import styles from './CourseManage.css'
import { Table, Icon, Input, Select, Popconfirm, Message } from 'antd'
import universalFetch, { handleFetchError } from '../../utils/fetch'
const Option = Select.Option
type Props = {
  data: Object
}
type States = {
  name: string,
  nameError: boolean,
  dataSource: Array<Object>,
  score: string,
  scoreError: boolean,
  type: string,
  typeError: boolean
}
class CourseManage extends React.Component {
  props: Props
  state: States
  constructor (props: Props) {
    super(props)
    this.state = {
      name: '',
      nameError: false,
      score: '',
      scoreError: false,
      dataSource: [],
      type: '',
      typeError: false
    }
  }
  componentWillMount () {
    this.getCourse()
  }
  delCourse = (item: Object) => {
    universalFetch(`${__API__}course/${item.systemId}`, {
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
        ), 'CourseManage.js')
      }
      this.getCourse()
    })
    .catch(handleFetchError)
  }
  getCourse = () => {
    const { data } = this.props
    const delCourse = this.delCourse
    universalFetch(`${__API__}course/${data.classId}`)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'CourseManage.js')
      }
      this.setState({
        dataSource: json.data.map((item, index) => {
          return {
            key: index,
            num: index + 1,
            name: item.name,
            score: item.credit,
            type: item.type === true ? '考试' : '考查',
            operate: <Popconfirm title='确定删除该课程么？' onConfirm={function () { delCourse(item) }}
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
  addCourse = () => {
    const { data } = this.props
    const { name, nameError, score, scoreError, type, typeError } = this.state
    type || this.setState({
      typeError: true
    })
    name || this.setState({
      nameError: true
    })
    score || this.setState({
      scoreError: true
    })
    if (!(name && score && type)) {
      return
    }
    if ((nameError && scoreError && typeError)) {
      return
    }
    let exam = false
    if (type === '考试') {
      exam = true
    }
    const postData = {
      classId: data.classId,
      credit: score,
      type: exam,
      name
    }
    universalFetch(`${__API__}course`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    .then(res => res.json())
    .then((json) => {
      if (json.code !== 0) {
        Message.error('添加课程失败TnT')
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'CourseManage.js')
      }
      Message.success('添加课程成功 ：)')
      this.setState({
        name: '',
        score: '',
        type: ''
      })
      this.getCourse()
    })
    .catch(handleFetchError)
  }
  changeType = (value: string) => {
    this.setState({
      type: value,
      typeError: !value
    })
  }
  changeName = (e: Object) => {
    this.setState({
      name: e.target.value,
      nameError: e.target.value.length > 30 || !e.target.value
    })
  }
  changeScore = (e: Object) => {
    this.setState({
      score: e.target.value,
      scoreError: e.target.value.length > 3 || !e.target.value
    })
  }
  render () {
    const columns = [{
      title: '序号',
      dataIndex: 'num',
      key: 'num'
    }, {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '学分',
      dataIndex: 'score',
      key: 'score'
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type'
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate'
    }]
    const baseSource = [{
      key: 999999,
      num: 0,
      name: (
        <span className={styles['input-span']}>
          <Input className={this.state.nameError ? styles['error'] : null}
            style={{ width: '200px' }} placeholder='请填写课程名称' onChange={this.changeName}
            value={this.state.name} /><br />
          <span className={styles['error-text']}>{this.state.nameError ? '请输入0-30位课程名称' : null}</span>
        </span>
      ),
      score: (
        <span className={styles['input-span']}>
          <Input className={this.state.scoreError ? styles['error'] : null}
            style={{ width: '200px' }} placeholder='请填写学分' onChange={this.changeScore}
            value={this.state.score} />
          <span className={styles['error-text']}>{this.state.scoreError ? '请输入正确学分' : null}</span>
        </span>
      ),
      type: (
        <div className={this.state.typeError ? [styles['new-input-span']] : styles['input-span']}>
          <Select style={{ width: '200px' }} onChange={this.changeType} placeholder='请选择类型'
            value={this.state.type}>
            <Option value='考试'>考试</Option>
            <Option value='考查'>考查</Option>
          </Select>
          <span className={styles['error-text']}>{this.state.typeError ? '请选择课程类型' : null}</span>
        </div>
      ),
      operate: <span className={styles['operate']} onClick={this.addCourse}><Icon type='plus-circle-o' />添加</span>
    }]
    return <div className={styles['main']}>
      <Table columns={columns} pagination={false} dataSource={baseSource.concat(this.state.dataSource)} />
    </div>
  }
}
export default CourseManage
