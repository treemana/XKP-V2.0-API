// @flow
import React from 'react'
import UserMenu from 'components/UserMenu'
import styles from './Header.css'

const Header = () => (
  <header className={styles['header']}>
    <UserMenu />
  </header>
);

export default Header
