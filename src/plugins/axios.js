import axios from "axios";

const httpClient = axios.create({
  baseURL: process.env.VUE_APP_DJANGO_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Setup token as an interceptor
const getAuthToken = () => 'JWT ' + localStorage.getItem('token');
const authInterceptor = (config) => {
  config.headers['Authorization'] = getAuthToken();
  return config;
}

httpClient.interceptors.request.use(authInterceptor);

export default httpClient;
