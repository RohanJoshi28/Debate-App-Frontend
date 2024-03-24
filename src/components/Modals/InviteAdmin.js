import React, { useState} from "react";
import "./InviteAdmin.css";

export default function InviteAdmin() {
    const [modal, setModal] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    
    const toggleModal = () => {
        if (!modal){
            setSuccess(false);
        }
        setModal(!modal);
        
        
    }

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
    
        e.preventDefault();
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        // You can pass formData as a fetch body directly:
        fetch('/save_email', { method: form.method, body: formData });
        toggleModal();
        setSuccess(true);
        window.location.reload();
    }

    if (modal){
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    return (
        <div>
        
        {isSuccess && (
            <p class="success">Successully added new admin!</p>
        )}

        <button
            onClick={toggleModal}
            className="btn-modal">
                Invite New Admins
        </button>

        

        {modal && (
            <div className="modal">
            <div onClick={toggleModal} className="overlay"></div>
            <div className="modal-content">
                <h1>Invite Admin</h1>
                <form method="post" onSubmit={handleSubmit}>
            <label>
                Name: <input name="name" />
            </label>
            
            <p></p>
            <label>
                Email: <input name="email" />
            </label>
            
            <hr />
            <button type="submit">Submit</button>
            </form>
            <button
                className='close-modal'
                onClick={toggleModal}>
                Close
            </button>
            </div>

        </div>
        )}

        

        

        
        </div>
    )
}