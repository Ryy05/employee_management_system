import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const clearDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.drop();
        }
        
        console.log('All collections deleted successfully.');
        process.exit(0); // Exit the process after deleting collections
    } catch (error) {
        console.error('Error deleting collections:', error);
        process.exit(1);
    }
};

clearDatabase();
