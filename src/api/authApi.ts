import axios, {
  type InternalAxiosRequestConfig,
  type AxiosError,
  type AxiosResponse,
  AxiosHeaders,
} from "axios";

/* ================= REDUX ================= */
import { store } from "../store/store";
import { logout } from "../store/authSlice";

/* ================= TOAST ================= */
import { toast } from "sonner";

/* =====================================================
   AXIOS INSTANCE
===================================================== */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* =====================================================
   EXTEND AXIOS CONFIG
===================================================== */

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    showLoader?: boolean;
  }
}

/* =====================================================
   GLOBAL LOADER SYSTEM
===================================================== */

let activeRequests = 0;

const startLoading = () => {
  activeRequests++;
  document.body.classList.add("loading");
};

const stopLoading = () => {
  activeRequests = Math.max(activeRequests - 1, 0);

  if (activeRequests === 0) {
    document.body.classList.remove("loading");
  }
};

/* =====================================================
   REQUEST INTERCEPTOR
===================================================== */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.showLoader !== false) {
      startLoading();
    }

    /* Attach token */
    const token = localStorage.getItem("token");

    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      config.headers.set("Authorization", `Bearer ${token}`);
    }

    /* Clean null/undefined */
    if (
      config.data &&
      typeof config.data === "object" &&
      !(config.data instanceof FormData)
    ) {
      Object.keys(config.data).forEach((key) => {
        const value = config.data[key];
        if (value === undefined || value === null) {
          delete config.data[key];
        }
      });
    }

    return config;
  },
  (error) => {
    stopLoading();
    return Promise.reject(error);
  }
);

/* =====================================================
   TOAST CONTROL (ANTI SPAM)
===================================================== */

let lastToastTime = 0;

const showToast = (message: string) => {
  const now = Date.now();

  if (now - lastToastTime > 1500) {
    toast.error(message);
    lastToastTime = now;
  }
};

/* =====================================================
   RESPONSE INTERCEPTOR
===================================================== */

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.showLoader !== false) {
      stopLoading();
    }

    /* Return ONLY data */
    return response.data;
  },

  (error: AxiosError<any>) => {
    if (error.config?.showLoader !== false) {
      stopLoading();
    }

    /* Network error */
    if (!error.response) {
      showToast("Server not reachable");
      return Promise.reject({
        message: "Server not reachable",
        status: 0,
      });
    }

    const status = error.response.status;

    const message =
      error.response.data?.message ||
      error.message ||
      "Something went wrong";

    /* Auto logout on 401 */
    if (status === 401) {
      const alreadyOnLogin =
        window.location.pathname === "/login";

      store.dispatch(logout());
      localStorage.removeItem("token");

      if (!alreadyOnLogin) {
        showToast("Session expired. Please login again.");

        setTimeout(() => {
          window.location.replace("/login");
        }, 300);
      }
    } else {
      showToast(message);
    }

    return Promise.reject({
      message,
      status,
    });
  }
);

/* =====================================================
   PROPER TYPE OVERRIDE
   (THIS FIXES YOUR TS ERROR)
===================================================== */

type ApiInstance = {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
};

/* Export correctly typed instance */
export default api as ApiInstance;