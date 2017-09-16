import React from 'react'
import { Button, Icon, Tag } from 'antd'

export default function ({ ele }:{ele: Object}) {
  return (
    <div style={{ position: 'fixed', top: 10, right: 20, zIndex: 999 }}>
      <Tag closable>单击按钮左右滚动</Tag>
      <Button.Group>
        <Button type='primary' onClick={() => { slideHandle(ele, true) }}>
          <Icon type='left' />
        </Button>
        <Button type='primary' onClick={() => { slideHandle(ele, false) }}>
          <Icon type='right' />
        </Button>
      </Button.Group>
    </div>
  )
}

const slideHandle = (ele: Object, flag: boolean) => {
  ele && ScrollAnim(ele, 200, flag)
}
function ScrollAnim (ele: Object, left: number, flag: boolean) {
  let index = 0
  const step = 10
  function play () {
    index += step
    if (flag) { ele.scrollLeft -= step } else { ele.scrollLeft += step }
    if (index < left) { window.requestAnimationFrame(play) }
  }
  window.requestAnimationFrame(play)
}
