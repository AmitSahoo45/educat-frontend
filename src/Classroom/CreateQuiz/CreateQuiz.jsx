import React, { useEffect, useState } from 'react'
import { Box, Button, Switch, Typography } from '@mui/material'
import { Check, Edit, Delete } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import { createQuizCall, updateQuizCall } from '../../store/slices/quiz'
import { openAlertMessage } from '../../store/actions/alertActions'
import { selectQuiz } from '../../store/slices/quiz'
import Navbar from '../Navbar/Navbar'

import '../../App.css'

const CreateQuiz = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const quiz = useSelector(selectQuiz)

    const [quizName, setQuizName] = useState('');
    const [quizSubTitle, setQuizSubTitle] = useState('');
    const [quizQuestion, setQuizQuestion] = useState('');
    const [quizOptions, setQuizOptions] = useState([
        { index: 1, option: '', isCorrect: false },
        { index: 2, option: '', isCorrect: false },
        { index: 3, option: '', isCorrect: false },
        { index: 4, option: '', isCorrect: false },
    ]);
    const [questions, setQuestions] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingQuiz, setIsEditingQuiz] = useState(false);

    const label = { inputProps: { 'aria-label': 'Size switch demo' } };
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const selectedQuiz = quiz.find(qz => qz._id === id)
            setQuizName(selectedQuiz.quizName)
            setQuizSubTitle(selectedQuiz.quizSubTitle)
            setQuestions(selectedQuiz.questions)
            setIsChecked(selectedQuiz.isChecked)
            setIsEditingQuiz(true)
        }
    }, [id])

    const markAsCorrectOption = (index) => {
        if (quizOptions.some(option => option.isCorrect))
            setQuizOptions(quizOptions.map(option => option.index === index ? { ...option, isCorrect: true } : { ...option, isCorrect: false }))
        else setQuizOptions(quizOptions.map(option => option.index === index ? { ...option, isCorrect: true } : option))
    }

    const handleOptionChange = (index, value) => {
        setQuizOptions(prevOptions => {
            const updatedOptions = [...prevOptions];
            updatedOptions[index - 1] = { ...updatedOptions[index - 1], option: value };
            return updatedOptions;
        });
    };

    const addQuestion = () => {
        if (!quizQuestion || !quizOptions[0].option || !quizOptions[1].option || !quizOptions[2].option || !quizOptions[3].option) {
            dispatch(openAlertMessage('Please fill all the fields', 'error'))
            return;
        }

        if (!quizOptions.some(option => option.isCorrect)) {
            dispatch(openAlertMessage('Please mark a correct option', 'error'))
            return;
        }

        switch (isEditing) {
            case true:
                const updatedQuestions = [...questions];
                updatedQuestions[questions.length - 1] = { quizQuestion, quizOptions };
                setQuestions(updatedQuestions);
                setIsEditing(false);
                setQuizQuestion('')
                setQuizOptions([
                    { index: 1, option: '', isCorrect: false },
                    { index: 2, option: '', isCorrect: false },
                    { index: 3, option: '', isCorrect: false },
                    { index: 4, option: '', isCorrect: false },
                ])
                dispatch(openAlertMessage('Question updated successfully', 'success'))
                setIsEditing(false)
                return;

            case false:
                setQuestions([...questions, { quizQuestion, quizOptions }]);
                setQuizQuestion('')
                setQuizOptions([
                    { index: 1, option: '', isCorrect: false },
                    { index: 2, option: '', isCorrect: false },
                    { index: 3, option: '', isCorrect: false },
                    { index: 4, option: '', isCorrect: false },
                ])
                dispatch(openAlertMessage('Question added successfully', 'success'))
                return;
            default:
                break;
        }
    }

    const EditQuestion = (index) => {
        setIsEditing(true)
        setQuizQuestion(questions[index].quizQuestion)
        setQuizOptions(questions[index].quizOptions)
    }

    const deleteQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    }

    const submitQuiz = () => {
        if (!quizName || !quizSubTitle) {
            dispatch(openAlertMessage('Please fill name/description', 'error'))
            return;
        }

        if (questions.length === 0) {
            dispatch(openAlertMessage('Please add atleast one question', 'error'))
            return;
        }

        switch (isEditingQuiz) {
            case true:
                dispatch(updateQuizCall({ quizName, quizSubTitle, questions, isChecked, id }))
                setQuizName('')
                setQuizSubTitle('')
                setQuestions([])
                setIsChecked(false)

                dispatch(openAlertMessage('Generating quiz, this might take some time', 'info'))
                dispatch(openAlertMessage('The quiz will appear in some moments', 'info'))
                history.push('/classroom')
                break;

            case false:
                dispatch(createQuizCall({ quizName, quizSubTitle, questions, isChecked }))
                setQuizName('')
                setQuizSubTitle('')
                setQuestions([])
                setIsChecked(false)

                dispatch(openAlertMessage('Generating quiz, this might take some time', 'info'))
                dispatch(openAlertMessage('The quiz will appear in some moments', 'info'))
                history.push('/classroom')
                break;

            default:
                break;
        }
    }

    return (
        <>
            <Navbar />
            <Box
                sx={{
                    backgroundColor: '#2F3136',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                <Box>
                    <Typography variant="subtitle1" sx={{ textAlign: 'center', marginTop: '2rem' }}>
                        {isEditingQuiz ? 'Edit Quiz' : 'Create Quiz'}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '2rem',
                    }}
                >
                    <input
                        type="text"
                        placeholder="Quiz Name"
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
                        required
                        style={{
                            backgroundColor: "#2f3136",
                            width: "80%",
                            height: "44px",
                            color: "white",
                            border: "1px solid white",
                            borderRadius: "8px",
                            fontSize: "14px",
                            padding: "0 10px",
                        }}
                    />

                    <textarea
                        required
                        type="text"
                        placeholder="Enter Instructions for the quiz here..."
                        value={quizSubTitle}
                        onChange={(e) => setQuizSubTitle(e.target.value)}
                        style={{
                            backgroundColor: "#2f3136",
                            width: "80%",
                            height: "44px",
                            color: "white",
                            border: "1px solid white",
                            borderRadius: "8px",
                            fontSize: "14px",
                            padding: "10px",
                            marginTop: "1rem",
                        }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '80%' }}>
                        <label className="rocker rocker-small">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onClick={() => setIsChecked(!isChecked)}
                            />
                            <span className="switch-left">Yes</span>
                            <span className="switch-right">No</span>
                        </label>

                        <Typography variant="caption2" sx={{ textAlign: 'center', marginTop: '10px' }}>
                            {isChecked ? 'Quiz is public and available to all' : 'Quiz is private and will be unavailable to others'}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{
                    marginX: 'auto',
                    width: '80%',
                    height: '1px',
                    backgroundColor: '#FFFFFF',
                    marginTop: '2rem'
                }} />

                {/* Quiz Questions */}
                {questions.map((question, index) => (
                    <Box sx={{
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: { xs: '100%', sm: '80%' }, marginX: 'auto', flexWrap: 'wrap', marginTop: '1rem', padding: { sm: '1rem', xs: '0.5rem' }, flexDirection: 'column',
                        border: '1px solid #FFFFFF', borderRadius: '8px'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography key={index} variant='body1'>
                                Q. {question.quizQuestion}
                            </Typography>
                            <Box>
                                <Edit sx={{ cursor: 'pointer', marginRight: '8px', color: '#01a2fa' }} onClick={() => EditQuestion(index)} />
                                <Delete sx={{ cursor: 'pointer' }} color='error' onClick={() => deleteQuestion(index)} />
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
                            Options: {question.quizOptions.map((option, index) => (
                                <Box key={index} sx={{ padding: { sm: '4px', xs: '6px' }, backgroundColor: '#FFFFFF', color: '#212121', marginLeft: '6px', borderRadius: '8px', marginBottom: '6px', }}>
                                    {option.option && (
                                        <Typography key={index} variant='caption2' sx={{ marginX: { sm: '6px', xs: '4px' } }}>
                                            {option.option}
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ))}

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '2rem'
                    }}>
                    <input
                        required
                        type="text"
                        value={quizQuestion}
                        onChange={(e) => setQuizQuestion(e.target.value)}
                        placeholder="Add Question"
                        style={{
                            backgroundColor: "#2f3136",
                            width: "80%",
                            height: "44px",
                            color: "white",
                            border: "1px solid white",
                            borderRadius: "8px",
                            fontSize: "14px",
                            padding: "0 10px",
                            marginTop: "1rem",
                        }}
                    />

                    <Typography variant="subtitle2" sx={{ textAlign: 'center', marginY: '10px' }}>Options</Typography>

                    <Box sx={{ width: '80%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

                        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <input
                                required
                                type="text"
                                value={quizOptions[0].option}
                                onChange={(e) => handleOptionChange(1, e.target.value)}
                                placeholder="Option 1"
                                style={{
                                    backgroundColor: "#2f3136",
                                    width: "100%",
                                    height: "44px",
                                    color: "white",
                                    border: "1px solid white",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    padding: "0 10px",
                                }}
                            />
                            <Check
                                sx={{
                                    position: 'absolute',
                                    right: '10px',
                                    color: quizOptions[0].isCorrect ? '#43B581' : '#FFFFFF',
                                    cursor: 'pointer',
                                }}
                                onClick={() => markAsCorrectOption(1)}
                            />
                        </Box>

                        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '1rem' }}>
                            <input
                                required
                                type="text"
                                value={quizOptions[1].option}
                                onChange={(e) => handleOptionChange(2, e.target.value)}
                                placeholder="Option 2"
                                style={{ backgroundColor: "#2f3136", width: "100%", height: "44px", color: "white", border: "1px solid white", borderRadius: "8px", fontSize: "14px", padding: "0 10px", }}
                            />
                            <Check sx={{ position: 'absolute', right: '10px', color: quizOptions[1].isCorrect ? '#43B581' : '#FFFFFF', cursor: 'pointer', }} onClick={() => markAsCorrectOption(2)} />
                        </Box>


                        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '1rem' }}>
                            <input
                                required
                                type="text"
                                value={quizOptions[2].option}
                                onChange={(e) => handleOptionChange(3, e.target.value)}
                                placeholder="Option 3"
                                style={{ backgroundColor: "#2f3136", width: "100%", height: "44px", color: "white", border: "1px solid white", borderRadius: "8px", fontSize: "14px", padding: "0 10px", }}
                            />
                            <Check sx={{ position: 'absolute', right: '10px', color: quizOptions[2].isCorrect ? '#43B581' : '#FFFFFF', cursor: 'pointer', }} onClick={() => markAsCorrectOption(3)} />
                        </Box>

                        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '1rem' }}>
                            <input
                                required
                                type="text"
                                value={quizOptions[3].option}
                                onChange={(e) => handleOptionChange(4, e.target.value)}
                                placeholder="Option 4"
                                style={{ backgroundColor: "#2f3136", width: "100%", height: "44px", color: "white", border: "1px solid white", borderRadius: "8px", fontSize: "14px", padding: "0 10px", }}
                            />
                            <Check sx={{ position: 'absolute', right: '10px', cursor: 'pointer', color: quizOptions[3].isCorrect ? '#43B581' : '#FFFFFF' }} onClick={() => markAsCorrectOption(4)} />
                        </Box>
                    </Box>

                    <Box>
                        <Button
                            sx={{
                                backgroundColor: '#43B581',
                                color: '#FFFFFF',
                                marginY: '1rem',
                            }}
                            onClick={addQuestion}
                        >
                            {isEditingQuiz ? 'Update Question' : 'Add Question'}
                        </Button>
                    </Box>

                    <Button
                        variant='outlined'
                        sx={{ color: '#FFFFFF', borderColor: '#FFFFFF', marginY: '1rem' }}
                        onClick={submitQuiz}
                    >
                        {isEditingQuiz ? 'Update Quiz' : 'Create Quiz'}
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default CreateQuiz