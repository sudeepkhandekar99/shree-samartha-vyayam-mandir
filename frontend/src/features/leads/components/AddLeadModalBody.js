import React, { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from '../../../components/Input/InputText';
import ErrorText from '../../../components/Typography/ErrorText';
import { showNotification } from "../../common/headerSlice";
import { addNewLead } from "../leadSlice";

const INITIAL_LEAD_OBJ = {
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    address: "",
    sex: "",
    age: "",
    date_of_birth: "",
    past_enrollment: "",
    phone_number: "",
    height: "",
    weight: ""
}

function AddLeadModalBody({ closeModal }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [leadObj, setLeadObj] = useState(INITIAL_LEAD_OBJ);

    const saveNewLead = () => {
        if (leadObj.first_name.trim() === "") return setErrorMessage("First Name is required!");
        else if (leadObj.email.trim() === "") return setErrorMessage("Email id is required!");
        // Additional validation or modification
        else {
            // Perform additional checks here if needed
            // For example, you can check the validity of the email address
            if (!isValidEmail(leadObj.email)) return setErrorMessage("Invalid email address!");

            // Automatically assign user ID
            const newLeadObjWithID = { ...leadObj, user_id: generateUserID() };

            // If all validations pass, dispatch the action to add a new lead
            dispatch(addNewLead({ newLeadObj: newLeadObjWithID }));
            dispatch(showNotification({ message: "New Lead Added!", status: 1 }));
            closeModal();
        }
    }
    
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
            <InputText type="text" updateType="first_name" containerStyle="mt-4" labelTitle="First Name" updateFormValue={updateFormValue} />
            <InputText type="text" updateType="middle_name" containerStyle="mt-4" labelTitle="Middle Name" updateFormValue={updateFormValue} />
            <InputText type="text" updateType="last_name" containerStyle="mt-4" labelTitle="Last Name" updateFormValue={updateFormValue} />
            <InputText type="email" updateType="email" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue} />
            <InputText type="text" updateType="address" containerStyle="mt-4" labelTitle="Address" updateFormValue={updateFormValue} />
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Sex</label>
                <select onChange={(e) => updateFormValue({ updateType: "sex", value: e.target.value })} value={leadObj.sex} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <InputText type="number" updateType="age" containerStyle="mt-4" labelTitle="Age" updateFormValue={updateFormValue} />
            <InputText type="date" updateType="date_of_birth" containerStyle="mt-4" labelTitle="Date of Birth" updateFormValue={updateFormValue} />
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Past Enrollment</label>
                <select onChange={(e) => updateFormValue({ updateType: "past_enrollment", value: e.target.value })} value={leadObj.past_enrollment} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
            <InputText type="text" updateType="phone_number" containerStyle="mt-4" labelTitle="Phone Number" updateFormValue={updateFormValue} />
            <InputText type="number" updateType="height" containerStyle="mt-4" labelTitle="Height" updateFormValue={updateFormValue} />
            <InputText type="number" updateType="weight" containerStyle="mt-4" labelTitle="Weight" updateFormValue={updateFormValue} />

            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewLead()}>Save</button>
            </div>
        </>
    );
}

export default AddLeadModalBody;
