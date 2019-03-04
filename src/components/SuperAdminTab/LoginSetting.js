// @flow
import React from 'react'
import styles from './LoginSetting.css'
import { Button, Col, message, Radio, Row, Table } from 'antd'
import universalFetch, { handleFetchError } from '../../utils/fetch'

const RadioGroup = Radio.Group

type States = {
  radioValue: string,
  acatemyList: Array<Object>,
  gradeList: Array<Object>,
  selectAcatemy: Array<Number>,
  selectGrade: Array<string>
}
class LoginSetting extends React.Component {
  state: States;
  constructor () {
    super()
    this.state = {
      radioValue: 'true',
      acatemyList: [],
      gradeList: [],
      selectAcatemy: [],
      selectGrade: []
    }
  }
  componentWillMount () {
    this.getAcatemy()
    this.getGrade()
  }
  sumbit = () => {
    const { radioValue, selectAcatemy, selectGrade } = this.state
    let status
    if (radioValue === 'true') {
      status = true
    } else {
      status = false
    }
    const putData = {
      academyIds: selectAcatemy,
      grades: selectGrade,
      status: status
    }
    universalFetch(`${__API__}login`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(putData)
    })
    .then(res => res.json())
    .then((json) => {
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'LoginSetting.js')
      }
      message.success('成功')
    })
    .catch(handleFetchError)
  };
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
        ), 'LoginSetting.js')
      }
      this.setState({
        gradeList: json.data.map((item, index) => {
          return {
            key: index,
            name: item
          }
        })
      })
    })
    .catch(handleFetchError)
  };
  getAcatemy = () => {
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
        ), 'LoginSetting.js')
      }
      this.setState({
        acatemyList: json.data.map((item, index) => {
          return {
            key: item.systemId,
            name: item.name
          }
        })
      })
    })
    .catch(handleFetchError)
  };
  changeRadio = (e: Object) => {
    console.log(e.target.value)
    this.setState({
      radioValue: e.target.value
    })
  };
  render () {
    const columns1 = [{
      title: '学院',
      dataIndex: 'name',
      key: 'name'
    }]
    const columns2 = [{
      title: '年级',
      dataIndex: 'name',
      key: 'name'
    }]
    const rowSelection1 = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys.length)
        this.setState({
          selectAcatemy: selectedRowKeys
        })
      }
    }
    const rowSelection2 = {
      onChange: (selectedRowKeys, selectedRows) => {
        const gradeList = []
        selectedRows.map((item, index) => {
          gradeList.push(item.name)
        })
        this.setState({
          selectGrade: gradeList
        })
      }
    }
    const { acatemyList, gradeList } = this.state
    return <div className={styles['main']}>
      <Row>
        <Col span={12}>
          <div className={styles['select-acatemy']}>
            <Table columns={columns1} rowSelection={rowSelection1} pagination={false} dataSource={acatemyList} />
          </div>
        </Col>
        <Col span={12}>
          <div className={styles['select-grade']}>
            <Table columns={columns2} rowSelection={rowSelection2} pagination={false} dataSource={gradeList} />
            <div className={styles['allow-login']}>
              <RadioGroup onChange={this.changeRadio} value={this.state.radioValue}>
                <Radio value='true'>允许登录</Radio>
                <Radio value='false'>禁止登录</Radio>
              </RadioGroup>
            </div>
            <div className={styles['sumbit']}>
              <Button type='primary' onClick={this.sumbit}>确认</Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  }
}
export default LoginSetting
