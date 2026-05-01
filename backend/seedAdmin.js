import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import District from './models/District.js';
import Office from './models/Office.js';
import Zone from './models/Zone.js'; // Ensure you import all relevant models

dotenv.config();

const clearDatabase = async () => {
    try {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
        console.log("✅ All collections cleared successfully.");
    } catch (error) {
        console.error("❌ Error clearing collections:", error.message);
    }
};

const createCEOUser = async () => {
    try {
        const newDistrict = await District.create({
            name: 'Sample District'
        });

        console.log('✅ District created successfully:', newDistrict);

        const ceoOffice = await Office.create({
            officeId: 'CEO001',
            officeName: 'CEO Office',
            officeType: 'Administrative',
            isDdo: true,
            address: 'District HQ, Sample District',
            contact: '1234567890'
        });

        console.log('✅ CEO Office created successfully:', ceoOffice);


        const ceoUser = new User({
            userName: 'ceoUser',
            password: 'ceoUser',
            role: 'CEO',
            passwordChanged: false,
            districtId: newDistrict._id,
            office: ceoOffice._id
        });
        await ceoUser.save();
        console.log('✅ CEO User created successfully:', ceoUser);

        newDistrict.officeId = ceoOffice._id;
        await newDistrict.save();
        console.log('✅ District updated with CEO Office successfully.');
        
        console.log('🎉 Database reset and seed completed successfully.');
    } catch (error) {
        console.error('❌ Error creating user:', error.message);
    }
};

const resetDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('✅ Database connected successfully.');

        await clearDatabase();

        await createCEOUser();
        
        process.exit();
    } catch (error) {
        console.error('❌ Error connecting to the database:', error.message);
        process.exit(1);
    }
};

resetDatabase();
