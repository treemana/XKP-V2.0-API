// @flow
import React from 'react'
import styles from './SuperAdminTab.css'
import AcatemyManage from './AcatemyManage'
import AdminManage from './AdminManage'
import LoginSetting from './LoginSetting'
import DataManage from './DataManage'
import TableQuery from 'components/TableQuery'
import ReleaseExplain from 'components/ReleaseExplain'
import ReactDom from 'react-dom'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

type Props = {
  data: Object
}
type States = {
  active: String
}
class SuperAdminTab extends React.Component {
  props: Props
  state: States
  constructor (props: Porps) {
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
            <AdminManage {...{
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
            <LoginSetting {...{
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
            <DataManage {...{
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
            <TableQuery {...{
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
    const tabList = ['管理员设置', '登录设置', '数据管理', '大表查询', '发布说明']
    const { data } = this.props
    return <div className={styles['main']}>
      <Tabs defaultActiveKey='1' onChange={this.changeTab}>
        <TabPane tab='学院管理' key='1'>
          <AcatemyManage {...{
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

export default SuperAdminTab
