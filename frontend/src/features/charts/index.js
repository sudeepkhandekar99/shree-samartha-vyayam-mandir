import React, { useState, useEffect } from 'react';

// Reusable Input component for editable fields
const EditableInput = ({ label, value, onChange, disabled }) => (
    <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring focus:border-indigo-500 ${disabled ? '' : ''}`}
            disabled={disabled}
        />
    </div>
);

function Charts() {
    const [userData, setUserData] = useState(null);
    const [originalUserData, setOriginalUserData] = useState(null);
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [editableField, setEditableField] = useState(null);

    const getUserData = async () => {
        try {
            const response = await fetch(`http://143.110.190.154:8000/personal-info/${registrationNumber}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            setUserData(responseData.response);
            setOriginalUserData(responseData.response);
            setEditableField(null);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleEdit = (field) => {
        setEditableField(field);
    };

    const handleFieldChange = (field, newValue) => {
        setUserData({ ...userData, [field]: newValue });
    };

    const handleReset = () => {
        setRegistrationNumber('');
        setUserData(null);
        setOriginalUserData(null);
        setEditableField(null);
    };

    const handleSave = async () => {
        try {
            const { id, ...userDataWithoutId } = userData;
            const apiUrl = `http://143.110.190.154:8000/personal_info/${registrationNumber}`;
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDataWithoutId),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            const { status, response: updatedData } = responseData;

            if (status === 'success') {
                setUserData(updatedData);
                setOriginalUserData(updatedData);
                setEditableField(null);
                console.log('Data updated successfully');
            } else {
                console.error('Error updating data');
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const handleFeesPaid = async () => {
        try {
            const apiUrl = `http://143.110.190.154:8000/update_fees_status/${registrationNumber}`;
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Assuming the response indicates success
            // You may want to handle the response accordingly based on your API
            console.log('Fees status updated successfully');

            // After updating fees status, re-fetch user data and re-render the form
            getUserData();
        } catch (error) {
            console.error('Error updating fees status:', error);
        }
    };

    const handleDownloadIdCard = async () => {
        try {
            const response = await fetch(`http://143.110.190.154:8000/download_student_id_card/${registrationNumber}`);
            const blob = await response.blob();

            // Create a link element to trigger the download
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `id_card_${registrationNumber}.png`;
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Remove the link element
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading ID card:', error);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-6">
            <div className="flex justify-between mb-4">
                <div className="rounded-md shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Enter Registration Number</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                            placeholder="Enter Registration Number"
                            className="border rounded-md p-2 w-full"
                        />
                    </div>
                    <button className="btn" onClick={getUserData}>
                        Get User Data
                    </button>
                    <button className="btn btn-ghost" onClick={handleReset}>Reset</button>
                </div>
            </div>

            {userData && (
                <div className="rounded-md shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">User Information</h2>
                    <form>
                        <EditableInput label="Name" value={userData.name} onChange={(value) => handleFieldChange('name', value)} />
                        <EditableInput label="Mobile Number" value={userData.mobile_number} onChange={(value) => handleFieldChange('mobile_number', value)} />
                        <EditableInput label="Sex" value={userData.sex} onChange={(value) => handleFieldChange('sex', value)} />
                        <EditableInput label="Age" value={userData.age} onChange={(value) => handleFieldChange('age', value)} />
                        <EditableInput label="Email" value={userData.email} onChange={(value) => handleFieldChange('email', value)} />
                        <EditableInput label="Address" value={userData.address} onChange={(value) => handleFieldChange('address', value)} />
                        <EditableInput label="Height" value={userData.height} onChange={(value) => handleFieldChange('height', value)} />
                        <EditableInput label="Weight" value={userData.weight} onChange={(value) => handleFieldChange('weight', value)} />
                        <EditableInput label="Date of Birth" value={userData.date_of_birth} onChange={(value) => handleFieldChange('date_of_birth', value)} />
                        <EditableInput label="Past Registration Info" value={userData.past_registration_info} onChange={(value) => handleFieldChange('past_registration_info', value)} />
                        <EditableInput label="Activity" value={userData.activity} onChange={(value) => handleFieldChange('activity', value)} />
                        <EditableInput label="Batch" value={userData.batch} onChange={(value) => handleFieldChange('batch', value)} />
                        <EditableInput label="Division" value={userData.division} onChange={(value) => handleFieldChange('division', value)} />
                        <EditableInput
                            label="Summer Camp ID"
                            value={userData.summer_camp_id !== 0 ? userData.summer_camp_id : "Fees Pending"}
                            onChange={(value) => handleFieldChange('division', value)}
                        />                        <EditableInput label="Fees Status" value={userData.fees_status ? 'Paid' : 'Unpaid'} onChange={(value) => handleFieldChange('fees_status', value)} disabled={true} />
                        <div className="mt-4">
                            <span className="mr-2">
                                <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
                            </span>
                            <span>
                                <button type="button" className="btn btn-success" onClick={handleFeesPaid}>Fees Paid</button>
                            </span>
                        </div>
                    </form>
                    <div className="mt-4">
                        <button
                            className="btn btn-primary"
                            onClick={handleDownloadIdCard}
                        >
                            Download ID Card
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Charts;
