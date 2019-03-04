// @flow
import React from 'react'
import './Home.css'
// import AdminTab from 'components/AdminTab'
import SuperAdminTab from 'components/SuperAdminTab'
import AdminTab from 'components/AdminTab'
import UserTab from 'components/UserTab'

type Props = {
  history: Object
}
type States = {
  data: Object
}
class Home extends React.Component {
  state: States;
  props: Props;
  constructor (props: Props) {
    super(props)
    this.state = {
      data: {}
    }
  }
  renderComponent = () => {
    const { data } = this.state
    if (data.data) {
      switch (data.data.type) {
        case 'A':
          return <SuperAdminTab {...{
            data: data.data
          }} />
        case 'B':
          return <AdminTab {...{
            data: data.data
          }} />
        case 'C':
          return <UserTab {...{
            data: data.data
          }} />
        default:
          return null
      }
    }
  };
  // componentDidMount () {
  // }
  componentWillMount () {
    if (!this.props.history.location.state) {
      localStorage.clear()
      this.props.history.push('/')
    } else {
      this.setState({
        data: this.props.history.location.state
      })
    }
  }
  render () {
    return <div className='main'>
      { this.renderComponent() }
    </div>
  }
}

export default Home
