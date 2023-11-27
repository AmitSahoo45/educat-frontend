import React, { useState, useEffect } from 'react'
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import Navbar from '../Navbar/Navbar'
import { FetchAllResults } from '../../api'
import { openAlertMessage } from '../../store/actions/alertActions'
import Loader from '../Loader'

const Results = () => {
    const [result, setResult] = useState([])
    const [length, setLength] = useState(0)
    const [quizName, setQuizName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()
    const { id } = useParams()

    const getResult = async () => {
        try {
            setIsLoading(true)
            const { data } = await FetchAllResults({ id })
            if (data?.status)
                throw new Error('Result not found')

            setResult(data.results)
            setLength(data.length)
            setQuizName(data.quizName)
            setIsLoading(false)
        } catch (error) {
            dispatch(openAlertMessage(error.message, 'error'))
        }
    }

    const calculateScore = (UserAttempted) => {
        let ctr = 0
        UserAttempted.forEach((question) => {
            if (question.isCorrect) ctr++
        })
        return ctr
    }

    useEffect(() => {
        if (id) getResult()
    }, [id])

    const Wrapper = ({ children }) => {
        return (
            <Box sx={{
                backgroundColor: "#202225",
                color: 'white',
                minHeight: '100vh',

            }}>
                {children}
            </Box>
        )
    }

    return (
        <Wrapper>
            <Navbar />

            {isLoading &&
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Loader />
                </Box>
            }

            {!isLoading &&
                <Box>
                    <Typography variant="h4" sx={{ textAlign: 'center', marginTop: '2rem' }}>
                        {quizName}
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sl No</TableCell>
                                    <TableCell align="right">Name</TableCell>
                                    <TableCell align="right">Email</TableCell>
                                    <TableCell align="right">Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {result?.map((quiz, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{index}</TableCell>
                                        <TableCell align="right">{quiz.user.username}</TableCell>
                                        <TableCell align="right">{quiz.user.mail}</TableCell>
                                        <TableCell align="right">
                                            {calculateScore(quiz.UserAttempted)} / {length}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            }
        </Wrapper>
    )
}

export default Results