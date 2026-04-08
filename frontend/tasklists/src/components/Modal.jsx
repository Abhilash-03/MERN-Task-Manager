import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import api from '../axios/axios';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {deleteUserStart, deleteUserSuccess, deleteUserFailure} from '../redux/user/userSlice';

export function WarningModal({ openModal, setOpenModal }) {
 const dispatch = useDispatch();
 const {uid}= useParams();
 const navigate = useNavigate();
 const handleDeleteAccount = async() => {
    dispatch(deleteUserStart());
   try {
   const res = await api.delete(`/api/v1/user/deleteAccount/${uid}`);
    if(res.status === 200){
        dispatch(deleteUserSuccess(res?.data))
        navigate('/register');
      } else {
        dispatch(deleteUserFailure(res?.data?.msg))

      }
   } catch (error) {
     dispatch(deleteUserFailure(error.response?.data?.msg))
   }

 }

  return (
    <>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => {
                setOpenModal(false);
                handleDeleteAccount();
                }}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
