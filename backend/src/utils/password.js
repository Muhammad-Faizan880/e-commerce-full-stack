import bcrypt from "bcryptjs";

// Hash password
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Compare password
export const comparePassword = async (
  enteredPassword,
  hashedPassword
) => {
  return await bcrypt.compare(
    enteredPassword,
    hashedPassword
  );
};