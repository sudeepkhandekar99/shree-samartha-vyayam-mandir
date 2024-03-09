import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';

const TopSideButtons = () => {
    const dispatch = useDispatch();

    const openAddNewLeadModal = () => {
        dispatch(openModal({ title: "Add New User", bodyType: "LEAD_ADD_NEW" }));
    };

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-600" onClick={() => openAddNewLeadModal()}>Add New</button>
        </div>
    );
};

function Leads() {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        // Fetch all users initially to populate the table
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const apiUrl = 'http://127.0.0.1:8000/users';
            const response = await fetch(apiUrl);
            const data = await response.json();
            setFilteredUsers([...data]); // Update filtered users when all users are fetched
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSearch = async () => {
        await handleReset(); // Reset before every search
        const searchTermLower = searchTerm.toLowerCase();
        setFilteredUsers(prevFilteredUsers => (
            prevFilteredUsers.filter(user =>
                user.name && user.name.toLowerCase().includes(searchTermLower)
            )
        ));
        setSearchTerm(''); // Clear the search field on reset
    };

    const handleReset = async () => {
        try {
            const apiUrl = 'http://127.0.0.1:8000/users';
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setFilteredUsers(data); // Reset to the entire list
        } catch (error) {
            console.error('Error fetching users on reset:', error);
            // You may choose to set an empty array or handle the error differently based on your requirements
            setFilteredUsers([]);
        }
    };

    useEffect(() => {
        console.log("filteredUsers after");
        console.log(filteredUsers);
    }, [filteredUsers]);

    return (
        <>
            <TitleCard title="Manage Students" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                <div className="flex items-center mb-4">
                    <input
                        type="text"
                        className="form-input btn ml-2"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn ml-2" onClick={handleSearch}>
                        Search
                    </button>
                    <button className="btn ml-2" onClick={handleReset}>
                        Reset
                    </button>
                </div>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>USER ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TitleCard>
        </>
    );
}

export default Leads;