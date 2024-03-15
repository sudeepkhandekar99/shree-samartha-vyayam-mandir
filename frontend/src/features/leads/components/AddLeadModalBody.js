import React, { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from '../../../components/Input/InputText';
import ErrorText from '../../../components/Typography/ErrorText';
import { showNotification } from "../../common/headerSlice";
import { addNewLead } from "../leadSlice";

const INITIAL_LEAD_OBJ = {
    name: "",
    mobile_number: "",
    email: "",
    address: "",
    sex: "",
    age: "",
    date_of_birth: "",
    height: "",
    weight: "",
    past_registration_info: "",
    activity: "",
    batch: "",
    division: "",
    fees_status: "",
}

function AddLeadModalBody({ closeModal }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [leadObj, setLeadObj] = useState(INITIAL_LEAD_OBJ);

    const saveNewLead = async () => {
        if (leadObj.name.trim() === "") return setErrorMessage("Name is required!");
        else if (leadObj.email.trim() === "") return setErrorMessage("Email id is required!");
        // Additional validation or modification
        else {
            // Perform additional checks here if needed
            // For example, you can check the validity of the email address
            if (!isValidEmail(leadObj.email)) return setErrorMessage("Invalid email address!");

            try {
                const registrationNumber = new Date().getTime();
                // Set registration_number to current time in milliseconds
                const apiUrl = 'http://143.110.190.154:8000/personal_info/';
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        registration_number: registrationNumber.toString(),
                        name: leadObj.name,
                        email: leadObj.email,
                        address: leadObj.address,
                        sex: leadObj.sex,
                        age: leadObj.age,
                        date_of_birth: leadObj.date_of_birth,
                        mobile_number: leadObj.mobile_number,
                        height: leadObj.height,
                        weight: leadObj.weight,
                        past_registration_info: leadObj.past_registration_info,
                        activity: leadObj.activity,
                        batch: "NA",
                        division: "NA",
                        fees_status: false, // Set fees_status to false
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const responseData = await response.json();

                // Assuming you have a response structure similar to the example
                const { status, response: savedLead } = responseData;

                if (status === 'success') {
                    // If all validations pass and backend save is successful
                    dispatch(addNewLead({ newLeadObj: savedLead }));
                    closeModal();
                    window.location.reload();
                    dispatch(showNotification({ message: "New Lead Added!", status: 1 }));
                } else {
                    setErrorMessage("Error saving lead data. Please try again.");
                }
            } catch (error) {
                console.error('Error saving lead data:', error);
                setErrorMessage("Error saving lead data. Please try again.");
            }
        }
    };



    // Function to validate email address
    const isValidEmail = (email) => {
        // You can use a regular expression or any other method to validate email
        // This is a simple regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to generate a random user ID
    const generateUserID = () => {
        // Generate a random number between 1000 and 9999
        return Math.floor(1000 + Math.random() * 9000);
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setLeadObj({ ...leadObj, [updateType]: value });
    }

    return (
        <>
            <InputText type="text" updateType="name" containerStyle="mt-4" labelTitle="Full Name" updateFormValue={updateFormValue} />
            <InputText type="text" updateType="mobile_number" containerStyle="mt-4" labelTitle="Phone Number" updateFormValue={updateFormValue} />
            <InputText type="email" updateType="email" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue} />
            <InputText type="text" updateType="address" containerStyle="mt-4" labelTitle="Address" updateFormValue={updateFormValue} />
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Sex</label>
                <select onChange={(e) => updateFormValue({ updateType: "sex", value: e.target.value })} value={leadObj.sex} className="mt-4 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Activity</label>
                <select onChange={(e) => updateFormValue({ updateType: "activity", value: e.target.value })} value={leadObj.activity} className="mt-4 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="">Select</option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                </select>
            </div>
            <InputText type="number" updateType="age" containerStyle="mt-4" labelTitle="Age" updateFormValue={updateFormValue} />
            <InputText type="date" updateType="date_of_birth" containerStyle="mt-4" labelTitle="Date of Birth" updateFormValue={updateFormValue} />
            <InputText type="number" updateType="height" containerStyle="mt-4" labelTitle="Height" updateFormValue={updateFormValue} />
            <InputText type="number" updateType="weight" containerStyle="mt-4" labelTitle="Weight" updateFormValue={updateFormValue} />
            <InputText type="text" updateType="past_registration_info" containerStyle="mt-4" labelTitle="Past Registration Info" updateFormValue={updateFormValue} />


            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewLead()}>Save</button>
            </div>
        </>
    );
}

export default AddLeadModalBody;
