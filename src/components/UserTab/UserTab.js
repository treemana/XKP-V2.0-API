// @flow
import React from 'react'
import styles from './UserTab.css'
import ClassManage from './ClassManage'
import Basic from './Basic'
import ModifyPwd from './ModifyPwd'
import CourseManage from './CourseManage'
import ResultInput from './ResultInput'
import ReleaseExplain from 'components/ReleaseExplain'
import TableQuery from 'components/TableQuery'
import ReactDom from 'react-dom'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

type Props = {
  data: Object
}
type States = {
  active: string
}
class UserTab extends React.Component {
  props: Props
  state: States
  constructor (props: Props) {
    super(props)
    this.state = {
      active: '1'
    }
    this.changeTab = this.changeTab.bind(this)
  }
  changeTab (activeKey: string) {
    const { data } = this.props
    const { active } = this.state
    if (activeKey === '1') {
      return
    }
    this.setState({
      active: activeKey
    })
    if (active !== '1') {
      const content = document.querySelector(`#tab${active}`)
      ReactDom.unmountComponentAtNode(content)
    }
    switch (activeKey) {
      case '2':
        setTimeout(() => {
          const container = document.querySelector(`#tab${activeKey}`)
          ReactDom.render(
            <Basic {...{
              data
            }} />,
            container
          )
        }, 0)
        break
      case '3':
        setTimeout(() => {
          const container = document.querySelector(`#tab${activeKey}`)
          ReactDom.render(
            <CourseManage {...{
              data
            }} />,
            container
          )
        }, 0)
        break
      case '4':
        setTimeout(() => {
          const container = document.querySelector(`#tab${activeKey}`)
          ReactDom.render(
            <ResultInput {...{
              data
            }} />,
            container
          )
        }, 0)
        break
      case '5':
        setTimeout(() => {
          const container = document.querySelector(`#tab${activeKey}`)
          ReactDom.render(
            <ModifyPwd {...{
              data
            }} />,
            container
          )
        }, 0)
        break
      case '6':
        setTimeout(() => {
          const container = document.querySelector(`#tab${activeKey}`)
          ReactDom.render(
            <TableQuery {...{
              data
            }} />,
            container
          )
        }, 0)
        break
      case '7':
        setTimeout(() => {
          const container = document.querySelector(`#tab${activeKey}`)
          ReactDom.render(
            <ReleaseExplain />,
            container
          )
        }, 0)
        break
      default:
        return null
    }
  }
  render () {
    const tabList = ['基本加分', '课程管理', '成绩录入', '修改密码', '大表查询', '发布说明']
    const { data } = this.props
    return <div className={styles['main']}>
      <Tabs defaultActiveKey='1' onChange={this.changeTab}>
        <TabPane tab='班级管理' key='1'>
          <ClassManage {...{
            data
          }} />
        </TabPane>
        {
          tabList.map((item, index) => {
            const id = 'tab' + (index + 2)
            return <TabPane tab={item} key={index + 2}>
              <div id={id} />
            </TabPane>
          })
        }
      </Tabs>
    </div>
  }
}

export default UserTab
