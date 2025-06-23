import axios from "axios";
import { endpoints } from "../apiEndpoints";


export const Login = async (data: any) => {
  return axios.post(`${endpoints.Lab_Reports.Loginwithpass}`, data);
};

export const otplogin = async (data: any) => {
  return axios.post(`${endpoints.Lab_Reports.Loginwithotp}`, data);
};

export const UserSignUp = async (data: any) => {
  return axios.post(`${endpoints.Lab_Reports.SignUpStart}`, data);
};

export const UserSignUpOtp = async (data: any) => {
  return axios.post(`${endpoints.Lab_Reports.SignUpotp}`, data);
};
export const UserSignUpOtpSubmit = async (data: any) => {
  return axios.post(`${endpoints.Lab_Reports.SignUpotpSubmit}`, data);
};
export const AbhaAdharCard = async (data: any) => {
  return axios.post(`${endpoints.Lab_Reports.abhaadharno}`, data);
};
export const AbhaAdharCardOtpVerify = async (data: any) => {
  return axios.post(`${endpoints.Lab_Reports.abhaadharotpverify}`, data);
};
export const AbhaCarddownload = async (data: any) => {
  return axios.post(`${endpoints.Lab_Reports.abhacarddownload}`, data);
export const UserSignUpResendotp = async (data: any) => {
  return axios.post(`${endpoints.Lab_Reports.SignUpResendotp}`, data);
};