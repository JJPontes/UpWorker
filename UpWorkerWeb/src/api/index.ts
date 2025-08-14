import axios from "axios";
import { toast } from "react-toastify";

// Lista de possíveis URLs da API (ordem de prioridade)
const API_URLS = [
  "/api", // proxy Vite
  "http://localhost:3010", // Docker
  "http://localhost:3005", // Backend local
  // Adicione outros endpoints se necessário
];

const tryApi = async (config: any) => {
  let lastError: unknown;
  for (const baseURL of API_URLS) {
    try {
      config.baseURL = baseURL;
      if (baseURL.includes("3005")) {
        // eslint-disable-next-line no-console
        console.log("[API] Requisição usando backend local na porta 3005");
      } else if (baseURL.includes("3010")) {
        // eslint-disable-next-line no-console
        console.log("[API] Requisição usando backend Docker na porta 3010");
      }
      return await axios.request(config);
    } catch (err: any) {
      lastError = err;
      // Só tenta o próximo se for erro de rede
      if (
        !(err.code === "ERR_NETWORK" || err.message?.includes("Network Error"))
      ) {
        throw err;
      }
    }
  }
  throw lastError;
};

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Intercepta respostas para mostrar toast de sucesso/erro
api.interceptors.response.use(
  (response) => {
    // Só mostra toast de sucesso para métodos que alteram dados
    if (
      ["post", "put", "patch", "delete"].includes(response.config.method || "")
    ) {
      toast.success("Operação realizada com sucesso!");
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // Erro retornado pelo servidor (ex: 500, 400, etc)
      const status = error.response.status;
      if (status === 500) {
        toast.error("Erro interno do servidor (500). Tente novamente mais tarde ou contate o suporte.");
      } else if (status === 400) {
        toast.error("Dados inválidos ou campos obrigatórios ausentes (400).");
      } else if (status === 404) {
        toast.error("Recurso não encontrado (404).");
      } else if (status === 403) {
        toast.error("Acesso negado (403). Você não tem permissão para esta ação.");
      } else {
        toast.error(`Erro ${status}: ${error.response.data?.erro || 'Ocorreu um erro.'}`);
      }
    } else {
      // Erro de rede ou sem resposta do servidor
      toast.error("Erro na comunicação com o servidor! Verifique sua conexão ou tente novamente.");
    }
    return Promise.reject(error);
  },
);

// Sobrescreve os métodos HTTP para usar o fallback
["get", "post", "put", "delete", "patch"].forEach((method) => {
  // @ts-ignore
  interface ApiRequestConfig
    extends Omit<
      import("axios").AxiosRequestConfig,
      "url" | "method" | "data"
    > {
    url: string;
    method: string;
    data?: any;
  }

  type ApiMethod = (
    url: string,
    data?: any,
    config?: ApiRequestConfig,
  ) => Promise<import("axios").AxiosResponse>;

  (api as unknown as Record<string, ApiMethod>)[method] = (
    ...args: [string, any?, ApiRequestConfig?]
  ) => {
    const [url, data, config] = args;
    const reqConfig: ApiRequestConfig = {
      method,
      url,
      ...(data ? { data } : {}),
      ...(config || {}),
    };
    return tryApi(reqConfig);
  };
});

export default api;
