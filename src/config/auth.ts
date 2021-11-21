export default {
    jwt: {
        secret: process.env.APP_SECRET || '9a1506a983e8113af2d5ef66220fa21d',
        expiresIn: '1d'
    }
};