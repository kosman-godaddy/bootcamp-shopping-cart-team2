import React, { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from '../pages/_app';
 
export default function DarkModeToggle() {
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  return (
    <IconButton onClick={toggleColorMode} color="inherit" aria-label="toggle dark mode">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}