import React, { useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { getLeadsContent } from "../leads/leadSlice"; // Uncomment this line
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TopSideButtons = () => {
    const dispatch = useDispatch();

    const openAddNewLeadModal = () => {
        dispatch(openModal({ title: "Add New User", bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW }));
    }

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewLeadModal()}>Add New</button>
        </div>
    )
}

function Integration() {
    const { leads } = useSelector(state => state.lead);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getLeadsContent());
    }, [dispatch]);

    const deleteCurrentLead = (index) => {
        dispatch(openModal({
            title: "Confirmation",
            bodyType: MODAL_BODY_TYPES.CONFIRMATION,
            extraObject: {
                message: `Are you sure you want to delete this Student?`,
                type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE,
                index
            }
        }));
    }

    const generateAndDownloadIDCard = (userData) => {
        const pdf = new jsPDF();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 200;
        canvas.height = 150;

        // Set background color based on age
        if (userData.age < 20) {
            ctx.fillStyle = 'yellow';
        } else {
            ctx.fillStyle = 'red';
        }

        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render user information
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.fillText(`User ID: ${userData.user_id}`, 10, 20);
        ctx.fillText(`Name: ${userData.first_name}`, 10, 40);
        ctx.fillText(`Age: ${userData.age}`, 10, 60);
        ctx.fillText(`Sex: ${userData.sex}`, 10, 80);

        // Convert canvas to image
        const imageData = canvas.toDataURL('image/jpeg');

        // Add image to PDF
        pdf.addImage(imageData, 'JPEG', 10, 10, 180, 130);

        // Download PDF
        pdf.save('identity_card.pdf');
    };

    return (
        <>
            <TitleCard title="Manage Students" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>USER ID</th>
                                <th>First Name</th>
                                <th>Age</th>
                                <th>Sex</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((l, k) => (
                                <tr key={k}>
                                    <td>{l.user_id}</td>
                                    <td>{l.first_name}</td>
                                    <td>{l.age}</td>
                                    <td>{l.sex}</td>
                                    <td>
                                        <button className="btn btn-square btn-ghost mr-2" onClick={() => deleteCurrentLead(k)}>
                                            <TrashIcon className="w-5" />
                                        </button>
                                        <button className="btn btn-sm btn-primary" onClick={() => generateAndDownloadIDCard(l)}>Download ID Card</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TitleCard>
        </>
    );
}

export default Integration;
