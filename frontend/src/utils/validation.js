// Simple validation helper for required fields
export const validateRequired = (value) => {
    if (!value || value.trim() === '') {
        return false;
    }
    return true;
};

// Validate email format
export const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};
