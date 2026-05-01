'use client'
import { useState, useEffect } from 'react';
import axiosClient from "@/api/axiosClient";
import { useRouter } from 'next/navigation';
import { useUser } from "@/context/UserContext";

const AddZonePage = () => {
  const [name, setName] = useState('');
  const [districts, setDistricts] = useState([]);
  const [zeoUserName, setZeoUserName] = useState('');
  const [zeoPassword, setZeoPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { user } = useUser();
  const districtId = user?.districtId;

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axiosClient.get('/districts'); // Ensure this route is configured in your backend
        setDistricts(response.data.districts);
      } catch (error) {
        console.error('Error fetching districts:', error.message);
      }
    };

    fetchDistricts();
  }, []);

  // Function to generate random password
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Automatically generate username and password when zone name is entered
  useEffect(() => {
    if (name) {
      const formattedName = name.trim().toLowerCase().replace(/\s+/g, '_');
      setZeoUserName(`zeo_${formattedName}`);
      setZeoPassword(generatePassword());
    }
  }, [name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name) {
      setError('Zone name is required');
      return;
    }

    try {
      const response = await axiosClient.post('/zones', { 
        name, 
        district: districtId,
        zeoUserName,
        zeoPassword,
        user
      });

      setSuccess('Zone and ZEO user added successfully!');
      setName('');
      setZeoUserName('');
      setZeoPassword('');
    } catch (error) {
      console.error(error.message);
      setError('Failed to create zone. Make sure the zone name is unique within the district.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Add New Zone</h1>

        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-500">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Zone Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter zone name"
              required
            />
          </div>

          

          <div>
            <label className="block text-gray-700"> ZEO Username</label>
            <input
              type="text"
              onChange={(e) => setZeoUserName(e.target.value)}
              value={zeoUserName}
              className="w-full p-2 border border-gray-300 rounded mt-1 "
              
            />
          </div>

          <div>
            <label className="block text-gray-700">Generated ZEO Password</label>
            <input
              type="text"
              onChange={(e) => setZeoPassword(e.target.value)}
              value={zeoPassword}
              className="w-full p-2 border border-gray-300 rounded mt-1 "
              
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Zone
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddZonePage;
