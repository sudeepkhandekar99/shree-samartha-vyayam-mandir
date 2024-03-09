import React, { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from '../../../components/Input/InputText';
import ErrorText from '../../../components/Typography/ErrorText';
import { showNotification } from "../../common/headerSlice";
import { addNewLead } from "../leadSlice";
import jsPDF from 'jspdf';

const INITIAL_LEAD_OBJ = {
    first_name: "",
   
    email: "",
    address: "",
    sex: "",
    age: "",
   
}

function AddcardModalBody({ closeModal }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [leadObj, setLeadObj] = useState(INITIAL_LEAD_OBJ);

    const saveNewLead = () => {
        // Your saveNewLead function remains the same
    }
    
    const isValidEmail = (email) => {
        // Your isValidEmail function remains the same
    }

    const generateUserID = () => {
        // Your generateUserID function remains the same
    }

    const updateFormValue = ({ updateType, value }) => {
        // Your updateFormValue function remains the same
    }

    const generateIdentityCards = () => {
        const doc = new jsPDF();
        // You need to implement the logic to generate identity cards using the leadObj data
        // Add logic to create identity cards in PDF format
        // You can refer to the logic in the Integration component for generating PDFs
        // Once you have the logic to generate identity cards, you can call doc.save('identity_cards.pdf') to download the PDF
    };

    return (
        <>
            {/* Input fields for User ID, Name, Age, Gender */}
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

            {/* Button to generate identity cards */}
            <div className="mt-4">
                <button className="btn btn-primary px-6" onClick={() => generateIdentityCards()}>Generate Identity Cards</button>
            </div>

            {/* Error message display */}
            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>

            {/* Modal action buttons */}
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewLead()}>Save</button>
            </div>
        </>
    );
}

export default AddcardModalBody;
