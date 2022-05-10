import { AppBar, Box, Toolbar, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import { Repos, ReposContextProvider } from './components/Repos';

function NavBar() {
  const [time, setTime] = useState<Date>(() => new Date(Date.now()));
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date(Date.now())), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box display="flex" justifyContent="right" width={1} py={2}>
          {/* <Typography variant="h6">Silver Overange</Typography> */}
          <Box textAlign="right">
            <Box my={1}>
              <Typography variant="h6">
                {time.toLocaleString('en-US', { timeZone: 'America/Toronto' })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export function App() {
  return (
    <div className="App">
      <NavBar />
      <ReposContextProvider>
        <Repos /> {/**Add Repos */}
      </ReposContextProvider>
    </div>
  );
}
