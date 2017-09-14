// @flow
import React from 'react'
import styles from './ModifyPwd.css'
import universalFetch, { handleFetchError } from 'utils/fetch'
import { Form, Input, Button, message } from 'antd'
const FormItem = Form.Item

type Props = {
  form: Object,
  data: Object
}
type State = {
  confirmDirty: boolean
}
class ModifyPwd extends React.Component {
  state: State
  props: Props
  constructor (props: Props) {
    super(props)
    this.state = {
      confirmDirty: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.checkConfirm = this.checkConfirm.bind(this)
    this.checkPassword = this.checkPassword.bind(this)
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }
  handleReset = () => {
    this.props.form.resetFields()
  }
  componentWillMount () {
  }
  handleConfirmBlur = (e: Object) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入密码不一致！')
    } else {
      callback()
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  handleSubmit (e: Object) {
    const { data } = this.props
    e.preventDefault()
    const putData = {
      systemId: data.systemId,
      oldPassword: this.props.form.getFieldValue('oldPassword'),
      newPassword: this.props.form.getFieldValue('password')
    }
    console.log(putData)
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        universalFetch(`${__API__}manager/change`, {
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
            ), 'AdminManage.js')
          }
          message.success('修改成功')
          this.handleReset()
        })
        .catch(handleFetchError)
      }
    })
  }
  render () {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    }
    const { getFieldDecorator } = this.props.form
    return <div className={styles['main']}>
      <Form onSubmit={this.handleSubmit} className={styles['login-form']}>
        <FormItem {...formItemLayout} label='旧密码'>
          {getFieldDecorator('oldPassword', {
            rules: [{ required: true, message: '请输入旧密码' }]
          })(
            <Input placeholder='请输入旧密码' />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label='新密码'>
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入新密码'
            }, {
              validator: this.checkConfirm
            }]
          })(
            <Input type='password' placeholder='请输入新密码' />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label='确认密码'>
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: '请确认密码'
            }, {
              validator: this.checkPassword
            }]
          })(
            <Input type='password' placeholder='请确认密码' onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem>
          <Button type='primary' htmlType='submit' className={styles['login-form-button']}>
            修改
          </Button>
        </FormItem>
      </Form>
    </div>
  }
}

export default Form.create()(ModifyPwd)
