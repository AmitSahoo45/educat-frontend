import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { FetchQuiz, SubmitQuizQuestion } from '../../api'
import Navbar from '../Navbar/Navbar'
import { openAlertMessage } from '../../store/actions/alertActions'
import { ContextStore } from '../../shared/context/Context'
import { useHistory } from 'react-router-dom'
import Loader from '../Loader'

const Quiz = () => {
    const [Quiz, setQuiz] = useState(null)

    const [loading, setLoading] = useState(true)
    const [ButtonLoading, setButtonLoading] = useState(false)

    const [randomQuestion, setRandomQuestion] = useState(null)
    const [selectedOptionByUser, setSelectedOptionByUser] = useState(null)
    const [hasAttemptedAllQues, setHasAttemptedAllQues] = useState(false)

    const dispatch = useDispatch()
    const history = useHistory()
    const { id } = useParams()

    const picKRandomQuestion = () => {
        const rndIdx = Math.floor(Math.random() * Quiz.questions.length)
        setRandomQuestion(Quiz.questions[rndIdx])
    }

    const getQuiz = async () => {
        try {
            setLoading(true)
            const { data: { quiz } } = await FetchQuiz({ id })
            if (!quiz) throw new Error('Quiz not found')

            setQuiz(quiz)
            setLoading(false)
        } catch (error) {
            dispatch(openAlertMessage(error.message, 'error'))
        }
    }

    const onClickOption = (option) => setSelectedOptionByUser(option)

    const submitOption = async () => {
        try {
            if (!selectedOptionByUser) throw new Error('Please select an option')

            setButtonLoading(true)

            const res = await SubmitQuizQuestion({
                id: Quiz._id,
                isCorrect: selectedOptionByUser.isCorrect,
                question: randomQuestion._id
            })

            if (!res.data.status) {
                setButtonLoading(false)
                throw new Error('Quiz is not accepting answers')
            }

            setSelectedOptionByUser(null)
            const newQuizQuestions = Quiz.questions.filter(question => question._id !== randomQuestion._id)
            setQuiz({ ...Quiz, questions: newQuizQuestions })
            picKRandomQuestion()
            dispatch(openAlertMessage('Your answer has been recorded', 'success'))
            setButtonLoading(false)
        } catch (error) {
            console.log(error)
            dispatch(openAlertMessage(error.message, 'error'))
        }
    }

    useEffect(() => {
        if (id) getQuiz()
    }, [id])

    useEffect(() => {
        if (Quiz)
            picKRandomQuestion();

        if (Quiz?.questions.length === 0)
            setHasAttemptedAllQues(true)
    }, [Quiz]);

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
        <>
            <Navbar />
            <Wrapper>
                {loading &&
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Loader />
                    </Box>
                }

                {(!Quiz?.isChecked || !Quiz) &&
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                        flexDirection: 'column'
                    }}>
                        <h1>Quiz is not available</h1>
                        <Button variant="contained" onClick={() => getQuiz()}>Refresh</Button>
                    </Box>
                }

                <Box sx={{
                    width: { xs: '100%', sm: '80%' },
                    marginX: 'auto',
                    paddingY: { xs: 4, sm: 6 },
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Typography sx={{
                            fontSize: { xs: '1.25rem', sm: '2rem' },
                            fontWeight: 'bold',
                            color: 'white'
                        }}>
                            {Quiz?.quizName}
                        </Typography>

                        <Typography variant='subtitle2' color='#90EE90'>
                            {Quiz?.isChecked && 'The Quiz is live'}
                        </Typography>
                    </Box>

                    <Typography sx={{ marginY: 3, lineHeight: '1.5rem' }}>
                        Some instructions or abouts before you begin the quiz: <br />
                        {Quiz?.quizSubTitle}
                    </Typography>

                    <Box>
                        {randomQuestion && (
                            <Box sx={{
                                backgroundColor: '#36393f',
                                padding: 2,
                                borderRadius: 2,
                                marginBottom: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                            }}>
                                <Typography sx={{}}>
                                    Q. {randomQuestion?.quizQuestion}
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginTop: 2
                                }}>
                                    {randomQuestion?.quizOptions.map((option, ind) => (
                                        <Button key={ind}
                                            sx={{
                                                color: '#FFFFFF',
                                                marginBottom: '8px',
                                                backgroundColor: 'transparent',
                                                width: '100%',
                                                justifyContent: 'flex-start',
                                                backgroundColor: `${selectedOptionByUser?.index === option.index ? '#1976d2' : 'transparent'}`,
                                                ":hover": { backgroundColor: '#1976d2' },
                                            }}
                                            onClick={() => onClickOption(option)}
                                            variant='outlined'
                                        >
                                            {ind + 1}. {option.option}
                                        </Button>
                                    ))}
                                </Box>

                                <Button
                                    variant='contained'
                                    color='success'
                                    sx={{ width: '70px', marginLeft: 'auto', marginTop: '0.7rem' }}
                                    onClick={() => submitOption()}
                                >
                                    {ButtonLoading ? '...' : 'Submit'}
                                </Button>
                            </Box>
                        )}

                        {hasAttemptedAllQues &&
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '100vh',
                                flexDirection: 'column'
                            }}>
                                <h1>You have attempted all questions</h1>
                                <Button variant="contained" onClick={() => history.push('/classroom')}>
                                    Go back to classroom
                                </Button>
                            </Box>
                        }
                    </Box>
                </Box>

            </Wrapper>
        </>
    )
}

export default Quiz