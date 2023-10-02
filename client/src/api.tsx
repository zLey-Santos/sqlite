


import axios from "axios";
import toast from "react-simple-toasts";

export const api = axios.create({
  baseURL: 'http://localhost:9000', // api
});

api.interceptors.request.use((config) => {
  console.log("enviando...");
  return config;
});

api.interceptors.response.use(
  (config) => {
    console.log("recebendo...");
    return config;
  },
  (error) => {
    if (error.response.status !== 422) {
      throw error;
    }

    const errors = error.response.data.issues.map((issue) => issue.message);
    errors.forEach((error) =>
      toast(error, {
        render(message) {
          return (
            <div className="p-2 rounded-md text-gray-100 bg-red-500">
              {message}
            </div>
          );
        },
      })
    );
  }
);
