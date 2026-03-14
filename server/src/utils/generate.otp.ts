import otpGenerator from "otp-generator";

const generateOtp = () => {
    // Generates a 6-digit numeric OTP
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });

    return otp;
}

export default generateOtp;