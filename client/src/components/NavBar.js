import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import GitHubIcon from '@material-ui/icons/GitHub'
import { Link } from '@material-ui/core'

export default function Navbar(props) {
  const { page } = props

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6">
          JS Games
        </Typography>

        <div className="flex ml-4 space-x-2">
          <div className={page === 'Home' ? "p-2 bg-indigo-500" : "p-2"}>
            <Link href="/" color="inherit"> Home </Link>
          </div>

          <div className="p-2">
            <Link
              href="https://github.com/alvinpiter/js-online-games"
              color="inherit"
              target="_blank"
            >
              <GitHubIcon />
            </Link>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}
