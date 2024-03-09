// Lead.js

import React, { useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { getLeadsContent } from "./leadSlice";
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import "../../tailwind.config"
const TopSideButtons = () => {
    const dispatch = useDispatch();

    const openAddNewLeadModal = () => {
        dispatch(openModal({ title: "Add New User", bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW }));
    }

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-600" onClick={() => openAddNewLeadModal()}>Add New</button>
        </div>
    )
}

function Leads() {
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

    return (
        <>
            <TitleCard title="Manage Students" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>USER ID</th>
                                <th>First Name</th>
                                <th>Middle Name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Sex</th>
                                <th>Age</th>
                                <th>Date of Birth</th>
                                <th>Past Enrollment</th>
                                <th>Email ID</th>
                                <th>Phone Number</th>
                                <th>Height</th>
                                <th>Weight</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((l, k) => (
                                <tr key={k}>
                                    <td>{l.user_id}</td>
                                    <td>{l.first_name}</td>
                                    <td>{l.middle_name}</td>
                                    <td>{l.last_name}</td>
                                    <td>{l.address}</td>
                                    <td>{l.sex}</td>
                                    <td>{l.age}</td>
                                    <td>{moment(l.date_of_birth).format("DD MMM YYYY")}</td>
                                    <td>{l.past_enrollment}</td>
                                    <td>{l.email}</td>
                                    <td>{l.phone_number}</td>
                                    <td>{l.height}</td>
                                    <td>{l.weight}</td>
                                    <td>
                                        <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentLead(k)}>
                                            <TrashIcon className="w-5" />
                                        </button>
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

export default Leads;
