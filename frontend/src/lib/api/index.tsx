
import axios from "axios";
import { addAuthorizationHeader } from "./interceptors/request";

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL: baseURL })
api.defaults.headers.common["Content-Type"] = "application/json";

api.interceptors.request.use(addAuthorizationHeader);
// → リクエストの時に、Authorizationヘッダーに、トークンを持たす処理を噛ませる。
//   これで、get、post、putなど通信で必ず発火することができる。

export default api;
