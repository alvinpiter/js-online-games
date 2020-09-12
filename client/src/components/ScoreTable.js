import React from 'react'
import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import UserSpan from './UserSpan'

export default function ScoreTable(props) {
  const { scores } = props

  return (
    <div className="w-1/3">
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell> Who </TableCell>
              <TableCell> Score </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.map(score => (
              <TableRow key={score.user.nickname}>
                <TableCell> <UserSpan user={score.user} /> </TableCell>
                <TableCell> {score.score} </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
