export const signupOtpTemplate = (otp) => {
  return `
    <p>Welcome to College Marketplace!</p>
    <p>Your verification code is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
  `;
};

export const passwordResetOtpTemplate = (otp) => {
  return `
    <p>Password reset requested.</p>
    <p>Your reset code is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
  `;
};

export const productApprovedTemplate = (product) => {
  return `
    <p>Your product "${product.title}" has been approved and is now live in the marketplace.</p>
  `;
};

export const itemSoldTemplate = (product) => {
  return `
    <p>Your product "${product.title}" has been marked as sold.</p>
  `;
};

