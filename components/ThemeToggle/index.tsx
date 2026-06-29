import React from 'react';
import Toggle from 'react-toggle';
import Moon from 'public/icons/moon.svg';
import Sun from 'public/icons/sun.svg';
import styles from './index.module.scss';

interface Props {
  darkMode: boolean;
  onChange: (dark: boolean) => void;
}

const ThemeToggle = ({ darkMode, onChange }: Props) => (
  <label className={styles.toggle}>
    <Toggle
      checked={darkMode}
      icons={{ unchecked: <Sun />, checked: <Moon /> }}
      onChange={(e) => onChange(e.target.checked)}
    />
  </label>
);

export default ThemeToggle;
