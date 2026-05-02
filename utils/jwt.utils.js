module.exports = {
    generateToken: (payload) => {
        const jwt = require('jsonwebtoken');
        const secretKey = process.env.JWT_SECRET || "development-secret";
        const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });
        return token;
    },
    verifyToken: (token) => {
        const jwt = require('jsonwebtoken');
        const secretKey = process.env.JWT_SECRET || "development-secret";
        try {
            const decoded = jwt.verify(token, secretKey);
            return decoded;
        } catch (err) {
            return null;
        }
    }
}
