// @flow
import React from 'react'
import styles from './Basic.css'
import { Table, Icon, Input, Select, Modal, Row, Col, message } from 'antd'
const Option = Select.Option
import universalFetch, { handleFetchError } from '../../utils/fetch'

type Props = {
  data: Object
}
type States = {
  dataSource: Array<Object>,
  cxpd: string,
  dy: string,
  wt: string,
  xsky: string,
  post: string,
  xskybz: string,
  postbz: string,
  visible: boolean,
  modalData: Object
}
class Basic extends React.Component {
  props: Props
  state: States
  constructor (props: Props) {
    super(props)
    this.state = {
      dataSource: [],
      cxpd: '',
      dy: '',
      wt: '',
      xsky: '',
      post: '',
      modalData: {},
      visible: false,
      xskybz: '',
      postbz: ''
    }
  }
  getTableData = () => {
    const { data } = this.props
    const updateScore = this.updateScore
    universalFetch(`${__API__}base-score/${data.classId}`)
      .then(res => res.json())
      .then((json) => {
        console.log(json)
        if (json.code !== 0) {
          throw new Error(JSON.stringify(
            {
              code: json.code,
              message: json.message
            }
          ), 'Basic.js')
        }
        this.setState({
          dataSource: json.data.map((item, index) => {
            return {
              key: index,
              num: item.studentNumber,
              name: item.name,
              cxpk: item.behavior,
              dy: item.moral,
              wt: item.activity,
              xsky: item.academic + (item.academicDesc ? `(${item.academicDesc})` : ''),
              post: item.duty + (item.dutyDesc ? `(${item.dutyDesc})` : ''),
              operate: <span className={styles['operate']} onClick={function () { updateScore(item) }}>
                <Icon type='edit' />修改</span>
            }
          })
        })
      })
      .catch(handleFetchError)
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  handleOk = () => {
    const { cxpd, dy, wt, xsky, post, xskybz, postbz, modalData } = this.state
    const data = {
      systemId: modalData.systemId,
      moral: dy,
      behavior: cxpd,
      academic: xsky,
      academicDesc: xskybz,
      activity: wt,
      duty: post,
      dutyDesc: postbz
    }
    universalFetch(`${__API__}base-score`, {
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
          ), 'Basic.js')
        }
        this.getTableData()
        this.setState({
          visible: false
        })
        message.success('修改成功')
      })
      .catch(handleFetchError)
  }
  changeInput = (e: Object) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  changeCxpd = (value: string) => {
    this.setState({
      cxpd: value
    })
  }
  componentWillMount () {
    this.getTableData()
  }
  updateScore = (item: Object) => {
    this.setState({
      visible: true,
      modalData: item,
      cxpd: item.behavior,
      dy: item.moral,
      wt: item.activity,
      xsky: item.academic,
      xskybz: item.academicDesc,
      post: item.duty,
      postbz: item.dutyDesc
    })
  }
  getData = () => {
    const { data } = this.props
    const updateScore = this.updateScore
    universalFetch(`${__API__}base-score/${data.classId}`)
      .then(res => res.json())
      .then((json) => {
        console.log(json)
        if (json.code !== 0) {
          throw new Error(JSON.stringify(
            {
              code: json.code,
              message: json.message
            }
          ), 'Basic.js')
        }
        this.setState({
          dataSource: json.data.map((item, index) => {
            return {
              key: index,
              num: item.studentNumber,
              name: item.name,
              cxpd: item.behavior,
              dy: item.moral,
              wt: item.activity,
              xsky: item.academic + `(${item.academicDesc})`,
              post: item.duty + `(${item.dutyDesc})`,
              operate: <span className={styles['operate']} onClick={function () { updateScore(item) }}>
                <Icon type='edit' />修改</span>
            }
          })
        })
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
      title: '操行评定',
      dataIndex: 'cxpk',
      key: 'cxpk'
    }, {
      title: '德育',
      dataIndex: 'dy',
      key: 'dy'
    }, {
      title: '文体',
      dataIndex: 'wt',
      key: 'wt'
    }, {
      title: '学术科研',
      dataIndex: 'xsky',
      key: 'xsky'
    }, {
      title: '职务',
      dataIndex: 'post',
      key: 'post'
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate'
    }]
    const { dataSource, cxpd, dy, wt, xsky, post, xskybz, postbz, modalData } = this.state
    return <div className={styles['main']}>
      <Table columns={columns} pagination={false} dataSource={dataSource} />
      <Modal
        title='修改基本加分'
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        maskClosable={false}
        width={600}
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
          <div className={styles['row']}>
            <span className={styles['title']}>操行评定：</span>
            <Select style={{ width: '150px' }} placeholder='新选择操行评定'
              onChange={this.changeCxpd} value={cxpd}>
              <Option value='优'>优</Option>
              <Option value='良'>良</Option>
              <Option value='中'>中</Option>
              <Option value='差'>差</Option>
            </Select>
          </div>
          <Row>
            <Col span={12}>
              <div className={styles['row']}>
                <span className={styles['title']}>德育：</span>
                <Input style={{ width: '150px' }} placeholder='请输入德育分'
                  onChange={this.changeInput} value={dy} name='dy' />
              </div>
            </Col>
            <Col span={12}>
              <div className={styles['row']}>
                <span className={styles['title']}>文体：</span>
                <Input style={{ width: '150px' }} placeholder='请输入文体分'
                  onChange={this.changeInput} value={wt} name='wt' />
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <div className={styles['row']}>
                <span className={styles['title']}>学术科研：</span>
                <Input style={{ width: '150px' }} placeholder='请输入学术科研分'
                  onChange={this.changeInput} value={xsky} name='xsky' />
              </div>
            </Col>
            <Col span={12}>
              <div className={styles['row']}>
                <span className={styles['title']}>学术科研备注：</span>
                <Input style={{ width: '150px' }} placeholder='请输入学术科研备注'
                  onChange={this.changeInput} value={xskybz} name='xskybz' />
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <div className={styles['row']}>
                <span className={styles['title']}>职务：</span>
                <Input style={{ width: '150px' }} placeholder='请输入职务分'
                  onChange={this.changeInput} value={post} name='post' />
              </div>
            </Col>
            <Col span={12}>
              <div className={styles['row']}>
                <span className={styles['title']}>职务分备注：</span>
                <Input style={{ width: '150px' }} placeholder='请输入职务分备注'
                  onChange={this.changeInput} value={postbz} name='postbz' />
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  }
}
export default Basic
