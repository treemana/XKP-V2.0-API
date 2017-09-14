// @flow
import React from 'react'
import styles from './Login.css'
import universalFetch, { handleFetchError } from 'utils/fetch'
import { Form, Icon, Input, Button } from 'antd'
const FormItem = Form.Item

type Props = {
  form: Object,
  history: Object
}
class Login extends React.Component {
  props: Props
  constructor (props: Props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentWillMount () {
  }
  handleSubmit (e: Object) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(this.props.form.getFieldsValue())
        const data = this.props.form.getFieldsValue()
        universalFetch(`${__API__}login`, {
          method: 'POST',
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
            ), 'login.js')
          }
          localStorage.setItem('token', json.data.token)
          this.props.history.push({
            pathname: '/home',
            state: {
              data: json.data
            }
          })
        })
        .catch(handleFetchError)
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return <div className={styles['main']}>
      <div className={styles['main-container']}>
        <div className={styles['title']}>
          <p>东北林业大学</p>
          <p>学生素质综合考评管理系统</p>
        </div>
        <Form onSubmit={this.handleSubmit} className={styles['login-form']}>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名！' }]
            })(
              <Input prefix={<Icon type='user' style={{ fontSize: 13 }} />} placeholder='请输入用户名' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }]
            })(
              <Input prefix={<Icon type='lock' style={{ fontSize: 13 }} />} type='password' placeholder='请输入密码' />
            )}
          </FormItem>
          <FormItem>
            <Button type='primary' htmlType='submit' className={styles['login-form-button']}>
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  }
}

export default Form.create()(Login)
