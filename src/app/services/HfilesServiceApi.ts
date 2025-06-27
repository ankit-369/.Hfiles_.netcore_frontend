import axios from "axios";
import { endpoints } from "../apiEndpoints";
import axiosInstance from "../utils/axiosClient";


export const Login = async (data: any) => {
  return axios.post(`${endpoints.Lab_Reports.Loginwithpass}`, data);
};

// export const otplogin = async (data: any) => {
//   return axios.post(`${endpoints.Lab_Reports.Loginwithotp}`, data);
// };

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
};


// NEW  API 

export const SignUpOTPVerify = async (data:any) => {
 return axios.post(`${endpoints.SIGN_UP.SignUpOTP}`,data)
};

export const AddSignUp = async (data:any) =>{
  return axios.post(`${endpoints.SIGN_UP.SignUpData}`,data)
}


// Login 

export const LoginPassword = async (data:any) =>{
  return axios.post(`${endpoints.LOGIN.LoginWithPassword}`, data)
}


export const LoginOTp = async (data:any) =>{
  return axios.post(`${endpoints.LOGIN.LoginOTP}`, data)
}


export const LoginWithOTPhahaha = async (data:any) =>{
  return axios.post(`${endpoints.LOGIN.LoginWithOtp}`, data)
}
// County code List

export const listCounty = async () =>{
  return axios.get(`${endpoints.COUNTRY_LIST.ListCountyCode}`)
}


// Profile Details 

export const BasicDetailsList = async (userId:number ) =>{
  return axiosInstance.get(`${endpoints.PROFILE_DETAILS.List_Details}/${userId }` )
}

export const ListFlag = async (userId: number) => {
  return axiosInstance.get(endpoints.PROFILE_DETAILS.FLAG(userId));
};


export const OTPSend = async (data:any) =>{
  return axiosInstance.post(`${endpoints.PROFILE_DETAILS.SEND_OTP}`,data)
}


export const VerigyOTps = async (data:any) =>{
  return axiosInstance.post(`${endpoints.PROFILE_DETAILS.VERIFY_OTP}`,data)
}

export const ListPincode = async (pincode :string) =>{
  return axiosInstance.get(`${endpoints.PROFILE_DETAILS.PINCODE}/${pincode}`)
}


export const AddProfile = async (userId:number,data:any) =>{
  return axiosInstance.patch(`${endpoints.PROFILE_DETAILS.UPDATE_PROFILE}/${userId}`,data)
}


/// Add Member

export const MemberAdd = async (userId:number,data:any) =>{
  return axiosInstance.post(`${endpoints.ADD_MEMEBER.AddMember}/${userId}`,data)
}

export const MemberExistingAdd = async (userId:number,data:any) =>{
  return axiosInstance.post(`${endpoints.ADD_MEMEBER.ExistingMember}/${userId}`,data)
}

export const MemberList = async (userId:number) =>{
  return axiosInstance.get(`${endpoints.ADD_MEMEBER.List_Member}/${userId}`)
}

export const OTpVerifyMember = async (data:any) =>{
  return axiosInstance.post(`${endpoints.ADD_MEMEBER.VerifyPhoneOTp}`,data)
}

export const OTpSubmitMember = async (data:any) =>{
  return axiosInstance.post(`${endpoints.ADD_MEMEBER.SubmitOtpVerify}`,data)
}


// INVITE MEMEBR 

export const InviteMember = async (payload :any) =>{
  return axiosInstance.post(`${endpoints.VERIFYMEMBER.IniteMember}`,payload);
}

export const InviteOTPs = async (payload :any) =>{
  return axiosInstance.post(`${endpoints.VERIFYMEMBER.InviteOTP}`,payload);
}

export const InvitePassword = async (payload :any) =>{
  return axiosInstance.post(`${endpoints.VERIFYMEMBER.InviteSetPassword}`,payload);
}


// HFID 

export const ListHFID = async (userId: number) => {
  return axiosInstance.get(endpoints.HFID.ListHfid(userId));
};


// ADD Reports 

export const ReportAdd = async (userId: number, payload: FormData) => {
  return axiosInstance.post(endpoints.REPORTADDED.AddReports(userId), payload, {
  });
};


export const ListReport = async (userId:number,reportType:string) =>{
  return axiosInstance.get(`${endpoints.REPORTADDED.ShowReports}?userId=${userId}&reportType=${reportType}`)
}