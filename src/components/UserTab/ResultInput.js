// @flow
import React from 'react'
import styles from './ResultInput.css'
import universalFetch, { handleFetchError } from 'utils/fetch'
import { Table, Icon, Input, Select, Modal, Row, Col, message, Form, Button } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

type States = {
  columns: Array<Object>,
  dataSource: Array<Object>,
  visible: boolean,
  modalData: Object,
  courseData: Array<Object>
}
type Props = {
  data: Object,
  form: Object
}
class ResultInput extends React.Component {
  props: Props
  state: States
  constructor (props: Props) {
    super(props)
    this.state = {
      columns: [{
        title: '学号',
        width: 100,
        dataIndex: 'num',
        key: 'num',
        fixed: 'left'
      }, {
        title: '姓名',
        width: 70,
        dataIndex: 'name',
        key: 'name',
        fixed: 'left'
      }],
      dataSource: [],
      visible: false,
      modalData: {},
      courseData: []
    }
    this.getCourse = this.getCourse.bind(this)
    this.getScore = this.getScore.bind(this)
    this.updateScore = this.updateScore.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit (e: Object) {
    const { modalData, courseData } = this.state
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const courses = Object.keys(values)
        let marks = []
        courses.map((item) => {
          let mark = {}
          mark.courseId = item
          let type
          courseData.map((course) => {
            if (course.systemId.toString() === item) {
              type = course.type
            }
          })
          mark.type = type
          if (type) {
            mark.examination = values[item]
          } else {
            mark.inspection = values[item]
          }
          marks.push(mark)
        })
        const data = {
          studentId: modalData.studentId,
          marks: marks
        }
        universalFetch(`${__API__}score`, {
          method: 'PUT',
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
              ), 'ResultInput.js')
            }
            this.getScore()
            this.setState({
              visible: false
            })
            message.success('修改成功')
          })
          .catch(handleFetchError)
      }
    })
  }
  handleOk () {
  }
  handleCancel () {
    this.setState({
      visible: false
    })
  }
  componentWillMount () {
    this.getCourse()
    this.getScore()
  }
  updateScore (item: Object) {
    console.log(this.state.courseData)
    console.log(item)
    this.setState({
      visible: true,
      modalData: item
    })
  }
  getScore () {
    const { data } = this.props
    const updateScore = this.updateScore
    let source = []
    universalFetch(`${__API__}score/${data.classId}`)
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
        json.data.map((item, index) => {
          const base = {
            key: item.studentNumber,
            num: item.studentNumber,
            name: item.name,
            operate: <span className={styles['operate']} onClick={() => { updateScore(item) }}>
              <Icon type='edit' />修改</span>
          }
          const more = {}
          item.marks.map((mark, i) => {
            const m = {
              [mark.courseId]: mark.type === true ? mark.examination : mark.inspection
            }
            Object.assign(more, m)
          })
          source.push(Object.assign(base, more))
        })
        this.setState({
          dataSource: source
        })
      })
      .catch(handleFetchError)
  }
  getCourse () {
    const { data } = this.props
    const { columns } = this.state
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
        const columns1 = json.data.map((item, index) => {
          return {
            title: <span>{item.name}<br />({item.credit})</span>,
            dataIndex: item.systemId,
            key: item.systemId,
            type: item.type
          }
        })
        this.setState({
          courseData: json.data,
          columns: columns.concat(columns1).concat([{
            title: '操作',
            width: 70,
            dataIndex: 'operate',
            key: 'operate',
            fixed: 'right'
          }])
        })
      })
      .catch(handleFetchError)
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { columns, dataSource, modalData, courseData } = this.state
    return <div className={styles['result-main']}>
      <Table columns={columns} pagination={false} dataSource={dataSource} scroll={{ x: '150%', y: 420 }} />
      <Modal
        title='修改成绩'
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={400}
        footer=''
        maskClosable={false}
      >
        <div className={styles['modal-main']}>
          <Row>
            <Col span={12}>
              <div className={styles['row']}>
                <span className={styles['title']}>姓名：</span>
                {modalData.name}
              </div>
            </Col>
            <Col span={12}>
              <div className={styles['row']}>
                <span className={styles['title']}>学号：</span>
                {modalData.studentNumber}
              </div>
            </Col>
          </Row>
          <Form onSubmit={this.handleSubmit}>
            {
              modalData['marks'] && courseData.map((item, index) => {
                if (item.type) {
                  return <FormItem
                    label={item.name}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                    key={index}
                  >
                    {getFieldDecorator(item.systemId.toString(), {
                      initialValue: modalData['marks'][index]['examination']
                    })(
                      <Input />
                    )}
                  </FormItem>
                } else {
                  return <FormItem
                    label={item.name}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                    key={index}
                  >
                    {getFieldDecorator(item.systemId.toString(), {
                      initialValue: modalData['marks'][index]['inspection']
                    })(
                      <Select>
                        <Option value='优秀'>优秀</Option>
                        <Option value='良好'>良好</Option>
                        <Option value='中等'>中等</Option>
                        <Option value='及格'>及格</Option>
                        <Option value='不及格'>不及格</Option>
                      </Select>
                    )}
                  </FormItem>
                }
              })
            }
            <FormItem
              wrapperCol={{ span: 8, offset: 4 }}
            >
              <Button type='primary' htmlType='submit'>
                Submit
              </Button>
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
  }
}
export default Form.create()(ResultInput)
