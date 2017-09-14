// @flow
import React from 'react'
import styles from './CourseManage.css'
import { Table, Icon, Input, Select, Popconfirm } from 'antd'
import universalFetch, { handleFetchError } from 'utils/fetch'
const Option = Select.Option

type Props = {
  data: Object
}
type States = {
  name: String,
  dataSource: Array<Object>,
  score: String,
  type: String
}
class CourseManage extends React.Component {
  props: Props
  state: States
  constructor (props: Props) {
    super(props)
    this.state = {
      name: '',
      score: '',
      dataSource: [],
      type: ''
    }
    this.changeName = this.changeName.bind(this)
    this.changeScore = this.changeScore.bind(this)
    this.changeType = this.changeType.bind(this)
    this.addCourse = this.addCourse.bind(this)
    this.getCourse = this.getCourse.bind(this)
    this.delCourse = this.delCourse.bind(this)
  }
  componentWillMount () {
    this.getCourse()
  }
  delCourse (item: Object) {
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
  getCourse () {
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
            type: item.type === true ? '考试' : '考察',
            operate: <Popconfirm title='确定删除该专业么？' onConfirm={function () { delCourse(item) }}
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
  addCourse () {
    const { data } = this.props
    const { name, score, type } = this.state
    if (!(name && score && type)) {
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
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'CourseManage.js')
      }
      this.setState({
        name: '',
        score: '',
        type: ''
      })
      this.getCourse()
    })
    .catch(handleFetchError)
  }
  changeType (value: String) {
    this.setState({
      type: value
    })
  }
  changeName (e: Object) {
    this.setState({
      name: e.target.value
    })
  }
  changeScore (e: Object) {
    this.setState({
      score: e.target.value
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
      name: <Input style={{ width: '200px' }} placeholder='请填写课程名称' onChange={this.changeName}
        value={this.state.name} />,
      score: <Input style={{ width: '200px' }} placeholder='请填写学分' onChange={this.changeScore}
        value={this.state.score} />,
      type: <Select style={{ width: '200px' }} onChange={this.changeType} placeholder='请选择类型'
        value={this.state.type}>
        <Option value='考试'>考试</Option>
        <Option value='考察'>考察</Option>
      </Select>,
      operate: <span className={styles['operate']} onClick={this.addCourse}><Icon type='plus-circle-o' />添加</span>
    }]
    return <div className={styles['main']}>
      <Table columns={columns} pagination={false} dataSource={baseSource.concat(this.state.dataSource)} />
    </div>
  }
}
export default CourseManage
