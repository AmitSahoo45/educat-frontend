import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FetchAllResults } from '../../api';

const initialState = {
    result: [],
    loading: false,
    error: null
};