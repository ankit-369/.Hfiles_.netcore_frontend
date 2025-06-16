import axios from "axios";
import { endpoints } from "../apiEndpoints";


export const otpGenerate = async (data: any) => {
  return axios.post(`${endpoints.Lab_Reports.OTP_GENERATE}`, data);
};