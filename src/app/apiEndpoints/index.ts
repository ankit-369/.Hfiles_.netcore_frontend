// // Api EndPoints


// export const API_Lab_Reports = "https://localhost:7227/api/";

// export const endpoints = {
//    Lab_Reports: {
//         OTP_GENERATE: API_Lab_Reports + "labs/signup/otp",
//     },
// }

// Api EndPoints

export const API_Lab_Reports = "https://localhost:44358/api/";

export const endpoints = {
   Lab_Reports: {
        Loginwithpass: API_Lab_Reports + "Login",
         Loginwithotp: API_Lab_Reports + "OtpLogin/send-otp",
         SignUpStart: API_Lab_Reports + "Signup/initiate",
         SignUpotp: API_Lab_Reports + "Signup/verify-otp",
          SignUpotpSubmit: API_Lab_Reports + "Signup/complete",
          SignUpResendotp: API_Lab_Reports + "Signup/resend-otp"
    },
}


