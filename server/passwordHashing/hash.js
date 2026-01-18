import bcrypt from 'bcrypt';

const hash = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(plainPassword, salt);
    return password;
};

export { hash };
