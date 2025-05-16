// src/apis/customAxios.ts
import axios from "axios";

const customAxios = axios.create({
  baseURL: "/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default customAxios;
