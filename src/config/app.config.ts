export const EnvConfiguration=()=>({
    environment:process.env.NODE_ENV || 'dev',
    mongodb:process.env.MONGO_URI || 'mongodb://localhost:27017/nest',
    port:process.env.PORT || 3002,
    
})