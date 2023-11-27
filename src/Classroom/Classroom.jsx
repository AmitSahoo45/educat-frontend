import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Button, Dialog, DialogContent, DialogTitle, LinearProgress, Slide, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles';
import { Public, PublicOff, Share, Edit, Delete, Close } from '@mui/icons-material'

import Navbar from './Navbar/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { selectQuiz, getQuiz, deleteQuizCall, ToggleQuizAvailabilityOfQuiz } from '../store/slices/quiz'
import { ContextStore } from '../shared/context/Context'
import { openAlertMessage } from '../store/actions/alertActions';
import Loader from './Loader';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Classroom = () => {
    const [open, setOpen] = useState(false);
    const [option, setOption] = useState(null)
    const [selectedQuiz, setSelectedQuiz] = useState(null)

    const quiz = useSelector(selectQuiz)
    const dispatch = useDispatch()
    const history = useHistory()
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const { user } = useContext(ContextStore);

    useEffect(() => {
        if (user) dispatch(getQuiz())
    }, [user])

    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleToggleQuizAvailability = (id, isChecked) => dispatch(ToggleQuizAvailabilityOfQuiz({ id, isChecked }))

    const openQuizModal = (id) => {
        setOption('view')
        const ChQuiz = quiz.find(qz => qz._id === id)
        setSelectedQuiz(ChQuiz)
        handleClickOpen()
    }

    const openDeleteModal = (id) => {
        setOption('delete')
        const { _id } = quiz.find(qz => qz._id === id)
        setSelectedQuiz(_id)
        handleClickOpen()
    }

    const handleDeleteQuiz = () => {
        dispatch(deleteQuizCall({ id: selectedQuiz }))
        dispatch(openAlertMessage('Quiz Deleted Successfully', 'success'))
        handleClose()
    }

    const closeQuizModal = () => {
        setOption(null)
        setSelectedQuiz(null)
        handleClose()
    }

    const CopyToClipBoard = (id) => {
        // navigator.clipboard.writeText(`http://localhost:3000/classroom/quiz/${id}`)
        navigator.clipboard.writeText(`https://studentaze.vercel.app/classroom/quiz/${id}`)
        dispatch(openAlertMessage('Link Copied to Clipboard', 'success'))
    }

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
                <Box sx={{ display: "flex", justifyContent: "space-between", paddingTop: '1.5rem', marginRight: '2rem', borderBottom: '1px solid #FFFFFF', width: '90%', marginX: 'auto' }}>
                    <Typography variant="h4" sx={{ marginBottom: '20px', paddingTop: "10px", fontSize: "1.5rem", display: "flex", justifyContent: "center" }}>WELCOME TO CLASSROOM</Typography>
                    <Button
                        variant="contained"
                        sx={{ marginLeft: "10px", marginRight: "10px", marginBottom: "20px" }}
                        onClick={() => { history.push('/classroom/create') }}
                    >
                        Create Quiz
                    </Button>
                </Box>
                {!quiz && <Typography variant="h5" sx={{ fontSize: "1.2rem", display: "flex", justifyContent: "center", marginTop: '20px' }}>No Quiz Created Yet</Typography>}

                {
                    quiz?.length === 0 ?
                        <Box sx={{ width: '100%' }}>
                            <Loader />
                        </Box>
                        :
                        quiz.map((qz, index) => {
                            return (
                                <Box key={index} sx={{ display: "flex", justifyContent: "center", width: '90%', marginX: 'auto' }}>
                                    <Box sx={{
                                        backgroundColor: "#36393F",
                                        color: 'white',
                                        width: '100%',
                                        marginY: '10px',
                                        padding: { sm: '16px', xs: '10px' },
                                        borderRadius: '5px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        flexDirection: 'column',
                                        '&:hover': { backgroundColor: '#202225' }
                                    }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                            <Typography variant="h5" sx={{ fontSize: "1.2rem" }}>{qz.quizName}</Typography>
                                            <div>
                                                <Button
                                                    variant='text'
                                                    color='primary'
                                                    onClick={() => openQuizModal(qz._id)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    variant='text'
                                                    color='primary'
                                                    onClick={() => history.push(`/classroom/results/${qz._id}`)}
                                                >
                                                    Results
                                                </Button>
                                            </div>
                                        </Box>
                                        <Typography variant="h5" sx={{ fontSize: "1.2rem" }}>
                                            {qz.quizSubTitle.slice(0, 100)}.....
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                            <Box
                                                sx={{ display: 'flex', marginTop: '10px', cursor: 'pointer' }}
                                                onClick={() => handleToggleQuizAvailability(qz._id, !qz.isChecked)}
                                            >
                                                {qz.isChecked ?
                                                    <>
                                                        <Public sx={{ color: '#90EE90', marginRight: '8px' }} />
                                                        <Typography variant='subtitle2'>The quiz is public.</Typography>
                                                    </>
                                                    :
                                                    <>
                                                        <PublicOff sx={{ color: '#FF0000', marginRight: '8px' }} />
                                                        <Typography variant='subtitle2'>The quiz is private.</Typography>
                                                    </>
                                                }
                                            </Box>
                                            <Box>
                                                <Share
                                                    sx={{ cursor: 'pointer', color: '#90EE90' }}
                                                    onClick={() => CopyToClipBoard(qz._id)}
                                                />
                                                <Edit
                                                    sx={{ cursor: 'pointer', marginLeft: { xs: '4px', sm: '8px', }, color: '#FFFF00' }}
                                                    onClick={() => history.push(`/classroom/edit/${qz._id}`)}
                                                />
                                                <Delete
                                                    sx={{ cursor: 'pointer', marginLeft: { xs: '4px', sm: '8px', }, color: '#FF0000' }}
                                                    onClick={() => openDeleteModal(qz._id)}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        })}
            </Wrapper>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                    {option === 'view' ?
                        <>
                            <Typography variant="h5" sx={{ fontSize: "1.2rem", color: '#36454F' }}>
                                {selectedQuiz?.quizName}
                            </Typography>
                            <Close sx={{ cursor: 'pointer' }} onClick={closeQuizModal} />
                        </> :
                        <>
                            <Typography variant="h5" sx={{ fontSize: "1.2rem", color: '#36454F', textAlign: 'center', width: '100%', marginY: '1rem' }}>
                                Delete Quiz
                            </Typography>
                        </>
                    }
                </DialogTitle>
                <DialogContent>
                    {
                        option === 'view' ?
                            <>
                                <Typography variant="h5" sx={{ fontSize: "1rem", color: '#36454F' }}>
                                    {selectedQuiz?.quizSubTitle}
                                </Typography>
                                <Box>
                                    {selectedQuiz?.questions?.map((question, index) => {
                                        return (
                                            <Box key={index} sx={{ display: "flex", justifyContent: "center", width: '90%' }}>
                                                <Box sx={{
                                                    width: '100%',
                                                    paddingY: { sm: '16px', xs: '10px' },
                                                    borderRadius: '5px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    flexDirection: 'column',
                                                }}
                                                >
                                                    <Typography variant="h5" sx={{ fontSize: "1.2rem", color: '#011635' }}>
                                                        Q. {question.quizQuestion}
                                                    </Typography>
                                                    {question?.quizOptions.map((option) => {
                                                        return (
                                                            <Box key={option._id}
                                                                sx={{
                                                                    display: "flex",
                                                                    justifyContent: "flex-start",
                                                                    width: '100%',
                                                                    marginX: 'auto',
                                                                    marginY: '6px',
                                                                    paddingX: { sm: '8px', xs: '6px' },
                                                                    backgroundColor: `${option.isCorrect ? '#90EE90' : '#eaeaea'}`,
                                                                    borderRadius: '8px', border: '1px solid #3539358a',
                                                                    ":hover": { cursor: 'pointer' }
                                                                }}>
                                                                <Typography variant="subtitle1">{option.index}. {option.option}</Typography>
                                                            </Box>
                                                        )
                                                    })}
                                                </Box>
                                            </Box>
                                        )
                                    })}
                                </Box>
                            </> :
                            <>
                                <Typography variant="h5" sx={{ fontSize: "1rem", color: '#36454F', textAlign: 'center' }}>
                                    Are you sure you want to <Typography color='red' sx={{ display: 'inline' }} ><b>delete</b></Typography> this quiz? <br />
                                    You can rather make it private by pressing on the <Typography color='green' sx={{ display: 'inline' }} ><b>private/public</b></Typography> button.
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <Button
                                        variant='outlined'
                                        sx={{ marginRight: '10px' }}
                                        onClick={closeQuizModal}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant='contained'
                                        sx={{ backgroundColor: '#FF0000' }}
                                        onClick={handleDeleteQuiz}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Classroom