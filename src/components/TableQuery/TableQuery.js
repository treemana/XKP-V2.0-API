// @flow
import React from 'react'
import styles from './TableQuery.css'
import { Table, Select, Icon, Row, Col, Button } from 'antd'
import universalFetch, { handleFetchError } from '../../utils/fetch'
const Option = Select.Option
type Props = {
  data: Object
}
type States = {
  specialty: string,
  classes: string,
  acatemy: string,
  grade: string,
  dataSource: Array<Object>,
  specialtyList: Array<Object>,
  classList: Array<Object>,
  acatemyList: Array<Object>,
  gradeList: Array<string>,
  showTable: boolean,
  columns: Array<Object>,
  buttonClick: boolean
}
class TableQuery extends React.Component {
  props: Props
  state: States
  constructor (props: Props) {
    super(props)
    this.state = {
      specialty: '',
      classes: '',
      acatemy: '',
      grade: '',
      acatemyList: [],
      specialtyList: [],
      classList: [],
      gradeList: [],
      dataSource: [],
      showTable: false,
      columns: [{
        title: '学号',
        dataIndex: 'num',
        width: 100,
        key: 'num'
      }, {
        title: '姓名',
        dataIndex: 'name',
        width: 100,
        key: 'name'
      }],
      buttonClick: false
    }
  }
  getCourse = () => {
    const { columns, classes, buttonClick } = this.state
    if (buttonClick) {
      return
    }
    this.setState({
      buttonClick: true
    })
    universalFetch(`${__API__}course/${classes}`)
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
          title: item.name,
          width: 40,
          dataIndex: item.systemId + item.name,
          key: item.systemId + item.name,
          type: item.type
        }
      })
      this.setState({
        showTable: true,
        columns: columns.concat(columns1).concat([{
          title: '学术科研与素质教育',
          dataIndex: 'academic',
          width: 40,
          key: 'academic'
        }, {
          title: '平均绩点',
          dataIndex: 'point',
          width: 40,
          key: 'point'
        }, {
          title: '操行评定',
          dataIndex: 'behavior',
          width: 40,
          key: 'behavior'
        }, {
          title: '德育',
          dataIndex: 'moral',
          width: 40,
          key: 'moral'
        }, {
          title: '文体',
          dataIndex: 'activity',
          width: 40,
          key: 'activity'
        }, {
          title: '其他',
          dataIndex: 'other',
          width: 40,
          key: 'other'
        }, {
          title: '职务',
          dataIndex: 'dutyDesc',
          width: 200,
          key: 'dutyDesc'
        }, {
          title: '智育',
          dataIndex: 'score',
          width: 80,
          key: 'score'
        }, {
          title: '总分',
          dataIndex: 'total',
          width: 80,
          key: 'total'
        }, {
          title: '综合排名',
          dataIndex: 'complexRank',
          width: 50,
          key: 'complexRank'
        }, {
          title: '智育排名',
          dataIndex: 'scoreRank',
          width: 40,
          key: 'scoreRank'
        }])
      })
    })
    .catch(handleFetchError)
  }
  getSpecialty = () => {
    const { data } = this.props
    if (data.type === 'C') {
      universalFetch(`${__API__}specialty-name/${data.specialtyId}`)
      .then(res => res.json())
      .then((json) => {
        console.log(json)
        if (json.code !== 0) {
          throw new Error(JSON.stringify(
            {
              code: json.code,
              message: json.message
            }
          ), 'TableQuery.js')
        }
        this.setState({
          specialty: data.specialtyId.toString(),
          specialtyList: [{
            systemId: data.specialtyId,
            name: json.data
          }]
        })
      })
      .catch(handleFetchError)
    }
  }
  getClass = () => {
    const { data } = this.props
    if (data.type === 'C') {
      universalFetch(`${__API__}class/${data.classId}`)
      .then(res => res.json())
      .then((json) => {
        console.log(json)
        if (json.code !== 0) {
          throw new Error(JSON.stringify(
            {
              code: json.code,
              message: json.message
            }
          ), 'TableQuery.js')
        }
        this.setState({
          classes: data.classId.toString(),
          classList: [{
            systemId: data.classId,
            name: json.data
          }]
        })
      })
      .catch(handleFetchError)
    }
  }
  downLoad = () => {
    const { classes } = this.state
    universalFetch(`${__API__}benchmark/download/${classes}`)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'TableQuery.js')
      }
    })
    .catch(handleFetchError)
  }
  componentWillMount () {
    const { data } = this.props
    this.getAcatemy()
    this.getSpecialty()
    this.getClass()
    if (data.type === 'C') {
      this.setState({
        grade: data.grade,
        gradeList: [data.grade]
      })
    }
  }
  getAcatemy = () => {
    const { data } = this.props
    if (data.type === 'C' || data.type === 'B') {
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
          ), 'TableQuery.js')
        }
        if (data.type === 'B') {
          this.setState({
            acatemyList: [{
              systemId: data.academyId,
              name: json.data
            }]
          })
        } else {
          this.setState({
            acatemy: data.academyId.toString(),
            acatemyList: [{
              systemId: data.academyId,
              name: json.data
            }]
          })
        }
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
          ), 'TableQuery.js')
        }
        this.setState({
          acatemyList: json.data
        })
      })
      .catch(handleFetchError)
    }
  }
  queryData = () => {
    this.getCourse()
    const { classes } = this.state
    let source = []
    universalFetch(`${__API__}benchmark/${classes}`)
    .then(res => res.json())
    .then((json) => {
      console.log(json)
      if (json.code !== 0) {
        throw new Error(JSON.stringify(
          {
            code: json.code,
            message: json.message
          }
        ), 'TableQuery.js')
      }
      json.data.map((item, index) => {
        const base = {
          key: item.studentNumber,
          num: item.studentNumber,
          name: item.name,
          academic: item.academic,
          activity: item.activity,
          behavior: item.behavior,
          complexRank: item.complexRank,
          dutyDesc: item.dutyDesc,
          moral: item.moral,
          other: item.other,
          point: item.point,
          score: item.score,
          scoreRank: item.scoreRank,
          total: item.total
        }
        const more = {}
        item.marks.map((mark, i) => {
          const m = {
            [mark.courseId + mark.name]: mark.type === true ? mark.examination : mark.inspection
          }
          Object.assign(more, m)
        })
        source.push(Object.assign(base, more))
      })
      this.setState({
        showTable: true,
        dataSource: source
      })
    })
    .catch(handleFetchError)
  }
  changeAcatemy = (value: string) => {
    this.setState({
      acatemy: value,
      specialty: '',
      grade: '',
      classes: ''
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
  changeSpecialty = (value: string) => {
    this.setState({
      specialty: value,
      grade: '',
      classes: ''
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
  changeClass = (value: string) => {
    this.setState({
      classes: value
    })
  }
  changeGrade = (value: string) => {
    const { specialty } = this.state
    this.setState({
      grade: value,
      classes: ''
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
  render () {
    const { specialty, acatemy, grade, acatemyList, specialtyList, classList,
      gradeList, showTable, classes, columns } = this.state
    return <div className={styles['main']}>
      <div className={styles['class-select']}>
        <Row>
          <Col span={5}>
            {
              acatemy
              ? <Select style={{ width: 150 }} onChange={this.changeAcatemy} placeholder='请选择学院'
                value={acatemy}>
                {
                  acatemyList.map((item, index) => {
                    return <Option value={item.systemId.toString()} key={index}>{item.name}</Option>
                  })
                }
              </Select>
              : <Select style={{ width: 150 }} onChange={this.changeAcatemy} placeholder='请选择学院'>
                {
                  acatemyList.map((item, index) => {
                    return <Option value={item.systemId.toString()} key={index}>{item.name}</Option>
                  })
                }
              </Select>
            }
          </Col>
          <Col span={5}>
            {
              specialty
              ? <Select style={{ width: 150 }} key={acatemy} onChange={this.changeSpecialty}
                placeholder='请选择专业' disabled={!acatemy} value={specialty}>
                {
                  specialtyList.map((item, index) => {
                    return <Option value={item.systemId.toString()} key={index}>{item.name}</Option>
                  })
                }
              </Select>
              : <Select style={{ width: 150 }} onChange={this.changeSpecialty}
                placeholder='请选择专业' disabled={!acatemy}>
                {
                  specialtyList.map((item, index) => {
                    return <Option value={item.systemId.toString()} key={index}>{item.name}</Option>
                  })
                }
              </Select>
            }
          </Col>
          <Col span={5}>
            {
              grade
              ? <Select style={{ width: 150 }} key={acatemy + specialty} onChange={this.changeGrade} value={grade}
                placeholder='请选择年级' disabled={!(specialty && acatemy)}>
                {
                  gradeList.map((item, index) => {
                    return <Option value={item} key={index}>{item}</Option>
                  })
                }
              </Select>
              : <Select style={{ width: 150 }} onChange={this.changeGrade}
                placeholder='请选择年级' disabled={!(specialty && acatemy)}>
                {
                  gradeList.map((item, index) => {
                    return <Option value={item} key={index}>{item}</Option>
                  })
                }
              </Select>
            }
          </Col>
          <Col span={5}>
            {
              classes
              ? <Select style={{ width: 150 }} key={acatemy + specialty + classes}
                onChange={this.changeClass} value={classes}
                placeholder='请选择班级' disabled={!(acatemy && specialty && grade)}>
                {
                  classList.map((item, index) => {
                    return <Option value={item.systemId.toString()} key={index}>{item.name}</Option>
                  })
                }
              </Select>
              : <Select style={{ width: 150 }} onChange={this.changeClass}
                placeholder='请选择班级' disabled={!(acatemy && specialty && grade)}>
                {
                  classList.map((item, index) => {
                    return <Option value={item.systemId.toString()} key={index}>{item.name}</Option>
                  })
                }
              </Select>
            }
          </Col>
          <Col span={2}>
            <Button type='primary' onClick={this.queryData} disabled={!(acatemy && specialty && grade && classes)}>
              <Icon type='search' />
              确定
            </Button>
          </Col>
          <Col span={2}>
            <Button type='primary' onClick={this.downLoad} disabled={!(acatemy && specialty && grade && classes)}>
              <Icon type='cloud-download' />
              下载
            </Button>
          </Col>
        </Row>
      </div>
      {
        showTable
        ? <div className={styles['table']}>
          <Table columns={columns} pagination={false}
            dataSource={this.state.dataSource} />
        </div>
        : null
      }
    </div>
  }
}
export default TableQuery
