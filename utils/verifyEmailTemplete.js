const verifyEmailTemplate = ({ name, otp }) => {
    return `
<div>
    <p>Dear ${name},</p>
    <p>Thank you for registering with ApiPractice. Please use the following OTP to verify your email address:</p>
    <div style="background:yellow; font-size:20px; padding:20px; text-align:center; font-weight:800;">
        ${otp}
    </div>
    <p>This OTP is valid for 10 minutes. Enter it on the ApiPractice website to complete your email verification.</p>
    <br/>
    <p>Thank you,</p>
    <p>The ApiPractice Team</p>
</div>
    `;
};

export default verifyEmailTemplate;
