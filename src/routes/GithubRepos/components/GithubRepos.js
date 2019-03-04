// @flow
import React from 'react'
import {Table} from 'antd'
import m from 'moment'

type Props = {
  fetchRepos: () => void,
  repos: Object
}

const columns = [{
  title: 'Name',
  dataIndex: 'name'
}, {
  title: 'Language',
  dataIndex: 'language'
}, {
  title: 'Fork',
  dataIndex: 'fork',
  render: (text) => {
    return String(text)
  }
}, {
  title: 'Description',
  dataIndex: 'description'
}, {
  title: 'CreatedAt',
  dataIndex: 'created_at',
  render: (text) => {
    return m(new Date(text)).format('YYYY-MM-DD HH:mm')
  }
}, {
  title: 'UpdatedAt',
  dataIndex: 'updated_at',
  render: (text) => {
    return String(text)
  }
}];

export class GithubReposView extends React.Component {
    props: Props;

  componentDidMount () {
      console.log(this.props);
      this.props.fetchRepos();
    if (document.referrer === '') {
      console.log(1)
    } else {
      console.log(2)
    }
  }

  render () {
      const {isFetching, data} = this.props.repos || {};
    return (
      <div>
        <Table columns={columns} dataSource={data} size='middle'
          loading={isFetching}
          rowKey={(record) => record.id} />
      </div>
    )
  }
}

export default GithubReposView
