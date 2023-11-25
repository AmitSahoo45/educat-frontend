import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
    createQuiz, FetchAllQuizzes, UpdateQuiz,
    DeleteQuiz, ToggleQuizAvailability,
} from '../../api';

const initialState = {
    quiz: [],
    loading: false,
    error: null
};

export const createQuizCall = createAsyncThunk('quiz/create', async ({ quizName, quizSubTitle, questions, isChecked }) => {
    await createQuiz({ quizName, quizSubTitle, questions, isChecked });
})

export const getQuiz = createAsyncThunk('quiz/all', async () => {
    const { data } = await FetchAllQuizzes();
    return data;
})

export const updateQuizCall = createAsyncThunk('quiz/update', async ({ quizName, quizSubTitle, questions, isChecked, id }) => {
    const { data } = await UpdateQuiz({ quizName, quizSubTitle, questions, isChecked, id });
    return data
})

export const deleteQuizCall = createAsyncThunk('quiz/delete', async ({ id }) => {
    await DeleteQuiz({ id });
    return id;
})

export const ToggleQuizAvailabilityOfQuiz = createAsyncThunk('quiz/update/availability', async ({ id, isChecked }) => {
    const { data } = await ToggleQuizAvailability({ id, isChecked });
    return data;
})

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {},
    extraReducers: {
        [getQuiz.pending]: (state, action) => {
            state.loading = true;
        },
        [getQuiz.fulfilled]: (state, action) => {
            state.loading = false;
            state.quiz = action.payload.quiz;
        },
        [getQuiz.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        [ToggleQuizAvailabilityOfQuiz.pending]: (state, action) => {
            state.loading = true;
        },
        [ToggleQuizAvailabilityOfQuiz.fulfilled]: (state, action) => {
            state.loading = false;
            const { quizId, isChecked } = action.payload;
            const quizIndex = state.quiz.findIndex(quiz => quiz._id === quizId);
            state.quiz[quizIndex].isChecked = isChecked;
        },
        [ToggleQuizAvailabilityOfQuiz.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        [deleteQuizCall.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteQuizCall.fulfilled]: (state, action) => {
            state.loading = false;
            const quizId = action.payload;
            state.quiz = state.quiz.filter(quiz => quiz._id !== quizId);
        },
        [deleteQuizCall.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
})

export const selectQuiz = state => state.quiz.quiz;

export default quizSlice.reducer;