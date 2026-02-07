import axios from "axios";

// TODO: 여기에 Apps Script 웹앱 /exec URL을 넣어주세요.
export const API_BASE_URL =
  "https://script.google.com/macros/s/AKfycbzH8xFM6Y1Carh0prFBjXC58KPYPneKbqcJoqh3CVpeu4SWvzoDcWG0-CmgWgLZC_Z-pA/exec";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

export default client;
