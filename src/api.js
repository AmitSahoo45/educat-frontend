import axios from "axios";
import { logout } from "./shared/utils/auth";

export const APIURLS = [
  "https://educat-backend-qx3f.onrender.com/api",
  "https://studentaze-backend.vercel.app/api",
  "https://educat-backend-2.vercel.app/api",
]

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "https://educat-backend-qx3f.onrender.com/api",
  timeout: 120000,
});

const apiClient2 = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "https://studentaze-backend.vercel.app/api",
  timeout: 120000,
});

apiClient.interceptors.request.use(
  (config) => {
    const userDetails = localStorage.getItem("user");

    if (userDetails) {
      const token = JSON.parse(userDetails).token;
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

apiClient2.interceptors.request.use(
  (config) => {
    const userDetails = localStorage.getItem("user");

    if (userDetails) {
      const token = JSON.parse(userDetails).token;
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// public routes

export const login = async (data) => {
  try {
    return await apiClient2.post("/auth/login", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const register = async (data) => {
  try {
    return await apiClient2.post("/auth/register", data);
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

// secure routes
export const sendFriendInvitation = async (data) => {
  try {
    return await apiClient.post("/friend-invitation/invite", data);
  } catch (exception) {
    checkResponseCode(exception);
    return {
      error: true,
      exception,
    };
  }
};

export const acceptFriendInvitation = async (data) => {
  try {
    return await apiClient.post("/friend-invitation/accept", data);
  } catch (exception) {
    checkResponseCode(exception);
    return {
      error: true,
      exception,
    };
  }
};

export const rejectFriendInvitation = async (data) => {
  try {
    return await apiClient.post("/friend-invitation/reject", data);
  } catch (exception) {
    checkResponseCode(exception);
    return {
      error: true,
      exception,
    };
  }
};

const checkResponseCode = (exception) => {
  const responseCode = exception?.response?.status;

  if (responseCode) {
    (responseCode === 401 || responseCode === 403) && logout();
  }
};

export const createQuiz = async (data) => {
  try {
    return await apiClient2.post("/quiz/create", data);
  } catch (exception) {
    checkResponseCode(exception);
    return {
      error: true,
      exception,
    };
  }
}

export const FetchAllQuizzes = async () => {
  try {
    return await apiClient2.get("/quiz/all");
  } catch (exception) {
    checkResponseCode(exception);
    return {
      error: true,
      exception,
    };
  }
}

export const UpdateQuiz = async (data) => {
  try {
    return await apiClient2.patch(`/quiz/update/${data.id}`, data);
  } catch (exception) {
    checkResponseCode(exception);
    return {
      error: true,
      exception,
    };
  }
}

export const DeleteQuiz = async ({ id }) => {
  try {
    return await apiClient2.delete(`/quiz/delete/${id}`);
  } catch (exception) {
    checkResponseCode(exception);
    return {
      error: true,
      exception,
    };
  }
}

export const ToggleQuizAvailability = async ({ id, isChecked }) => {
  try {
    return await apiClient2.patch(`/quiz/update/${id}/activity`, { isChecked });
  } catch (exception) {
    checkResponseCode(exception);
    return {
      error: true,
      exception,
    };
  }
}

export const FetchQuiz = async ({ id }) => {
  try {
    return await apiClient2.get(`/quiz/${id}`);
  } catch (exception) {
    checkResponseCode(exception);
    return {
      error: true,
      exception,
    };
  }
}

export const SubmitQuizQuestion = async ({ id, isCorrect, question }) => {
  try {
    return await apiClient2.patch(`/quiz/${id}/submit`, { isCorrect, question });
  } catch (exception) {
    checkResponseCode(exception);
    return {
      error: true,
      exception,
    };
  }
}