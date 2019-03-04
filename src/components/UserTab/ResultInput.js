// @flow
import React from 'react'
import styles from './ResultInput.css'
import universalFetch, { handleFetchError } from '../../utils/fetch'
import { Button, Col, Form, Icon, Input, message, Modal, Row, Select, Spin, Table } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
type States = {
  columns: Array<Object>,
  dataSource: Array<Object>,
  visible: boolean,
  uploading: boolean,
  modalData: Object,
  courseData: Array<Object>
}
type Props = {
  data: Object,
  form: Object
}
class ResultInput extends React.Component {
  props: Props;
  state: States;
  constructor (props: Props) {
    super(props)
    this.state = {
      uploading: false,
      columns: [{
        title: '学号',
        width: 100,
        dataIndex: 'num',
        key: 'num'
      }, {
        title: '姓名',
        width: 70,
        dataIndex: 'name',
        key: 'name'
      }],
      dataSource: [],
      visible: false,
      modalData: {},
      courseData: []
    }
  }
  uploadExcel = (info) => {
    console.log(info)
    this.setState({
      uploading: true
    })
    const file = info.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    universalFetch(`${__API__}score-table`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then((json) => {
        console.log(json.code)
        if (json.code !== 0) {
          console.log(json.code)
          this.setState({
            uploading:false
          })
          throw new Error(JSON.stringify(
            {
              code: json.code,
              message: json.message
            }
          ), 'ResultInput.js')
        }
        this.setState({
          columns: [{
            title: '学号',
            width: 100,
            dataIndex: 'num',
            key: 'num'
          }, {
            title: '姓名',
            width: 70,
            dataIndex: 'name',
            key: 'name'
          }]
        })
        this.getCourse()
        this.getScore()
        message.success('导入成功')
        this.setState({
          uploading:false
        })
      })
      .catch(handleFetchError)
  };
  handleSubmit = (e: Object) => {
    const { modalData, courseData } = this.state
    console.log(modalData, courseData)
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
  };
  handleOk = () => {
  };
  handleCancel = () => {
    this.setState({
      visible: false
    })
  };
  componentWillMount () {
    this.getCourse()
    this.getScore()
  }
  updateScore = (item: Object) => {
    console.log(this.state.courseData)
    console.log(item)
    this.setState({
      visible: true,
      modalData: item
    })
  };
  getScore = () => {
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
  };
  getCourse = () => {
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
            key: 'operate'
          }])
        })
      })
      .catch(handleFetchError)
  };
  render () {
    const { getFieldDecorator } = this.props.form
    const { columns, dataSource, modalData, courseData, visible, uploading } = this.state
    return <div className={styles['result-main']}>
      <Row className={styles['uploadButton']}>
        <Button>
          <Spin spinning={uploading} size='small' />Excel导入
          <input type='file' name='file' className={styles['realfile']} size='100' onChange={this.uploadExcel} />
        </Button>
      </Row>
      <Table columns={columns} pagination={false} dataSource={dataSource} />
      <Modal
        title='修改成绩'
        key={visible.toString() + modalData.studentNumber}
        visible={visible}
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
                if (item.type) { // 数字
                  // 遍历如果分数id===课程id，将分数追加于课程元素
                  let nullFlag = false // 判断该学生是否存在分数
                  for (let i: number = 0; i < modalData['marks'].length; i++) {
                    if (modalData['marks'][i]['courseId'] === item.systemId) {
                      item.score = modalData['marks'][i]['examination']
                      nullFlag = true
                    }
                  }
                  if (nullFlag === false) {
                    item.score = ''
                  }
                  return <FormItem
                    label={item.name}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                    key={index}
                  >
                    {getFieldDecorator(item.systemId.toString(), {
                      initialValue: item.score ? item.score : ''
                    })(<Input />)}
                  </FormItem>
                } else { // 选择
                  let nullFlag = false
                  for (let i: number = 0; i < modalData['marks'].length; i++) {
                    if (modalData['marks'][i]['courseId'] === item.systemId) {
                      item.score = modalData['marks'][i]['inspection']
                      nullFlag = true
                    }
                  }
                  if (nullFlag === false) {
                    item.score = ''
                  }
                  return <FormItem
                    label={item.name}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                    key={index}
                  >
                    {getFieldDecorator(item.systemId.toString(), {
                      initialValue: item.score ? item.score : ''
                    })(
                      <Select>
                        <Option value={null}>未选</Option>
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
                确定
              </Button>
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
  }
}
export default Form.create()(ResultInput)
