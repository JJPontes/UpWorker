// Ponte para garantir que `import ... from "../../api"` funcione
// Reexporta o default do módulo em src/api/index.ts
export { default } from "./api/index";
