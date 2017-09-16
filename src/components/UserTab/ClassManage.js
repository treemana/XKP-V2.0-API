// @flow
import React from 'react'
import styles from './ClassManage.css'
import { Table, Form, Input, Row, Col, Button, Popconfirm, Icon } from 'antd'
import universalFetch, { handleFetchError } from 'utils/fetch'
const FormItem = Form.Item
type Props = {
  data: Object,
  form: Object
}
type States = {
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
      dataSource1: [],
      dataSource2: [],
      dataSource3: []
    }
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
  submitHandle = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.addStudent(values)
      }
    })
  };
  addStudent (values) {
    const { data } = this.props
    console.log(data)
    const { num, name } = values
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
    const { dataSource1, dataSource2, dataSource3 } = this.state
    const { getFieldDecorator, getFieldsError } = this.props.form
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
        <Form layout='inline' onSubmit={this.submitHandle}>
          <Row>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('num', {
                  rules: [{ required: true, len:10, message: '请输入十位学号!' }]
                })(
                  <Input prefix={<Icon type='user' style={{ fontSize: 13 }} />}
                    style={{ width: '200px' }} placeholder='学号' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('name', {
                  rules: [{ required: true, max:20, message: '请输入正确姓名!' }]
                })(
                  <Input prefix={<Icon type='user' style={{ fontSize: 13 }} />}
                    style={{ width: '200px' }} placeholder='姓名' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <Button
                type='primary'
                htmlType={'submit'}
                disabled={hasErrors(getFieldsError())}
              >
                添加
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  }
}
const newClassManage = Form.create()(ClassManage)
export default newClassManage
function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}
