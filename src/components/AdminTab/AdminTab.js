// @flow
import React from 'react'
import styles from './AdminTab.css'
import ReleaseExplain from 'components/ReleaseExplain'
import TableQuery from 'components/TableQuery'
import SpecialtyManage from './SpecialtyManage'
import ClassManage from './ClassManage'
import AdminManage from 'components/SuperAdminTab/AdminManage'
import ReactDom from 'react-dom'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

type Props = {
  data: Object
}
type States = {
  active: string
}
class AdminTab extends React.Component {
  state: States
  props: Props
  constructor (props: Props) {
    super(props)
    this.state = {
      active: '1'
    }
    this.changeTab = this.changeTab.bind(this)
  }
  componentWillMount () {
    console.log(this.props.data)
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
            <ClassManage {...{
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
            <AdminManage {...{
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
            <TableQuery {...{
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
    const { data } = this.props
    const tabList = ['班级管理', '管理员设置', '大表查询', '发布说明']
    return <div className={styles['main']}>
      <Tabs defaultActiveKey='1' onChange={this.changeTab}>
        <TabPane tab='专业管理' key='1'>
          <SpecialtyManage {...{
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

export default AdminTab
