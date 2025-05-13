import { Scroll, LogOut, LogIn } from 'lucide-react'
import '../Styles/Navbar.css'
import { Link } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Navbar({ CurrentUser, CurrentHash}) {

    const navigate = useNavigate();

    // Logout
    function Logout() {
        localStorage.removeItem("token");
        googleLogout();
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }

    return ( 
        <>
            <div className="navbar-container">
                <p>
                   {
                    CurrentHash == '/documents-add' ?
                    "Add a Document"
                    :
                    CurrentHash == '/documents' ?
                    "Documents"
                    :
                    CurrentHash == '/user' ?
                    "Your Company"
                    :
                    CurrentHash.startsWith('/invoice/') ?
                    "Invoice"
                    :
                    "Invoice Registry"
                } 
                    
                </p>

                <div className="navbar-user">
                
                    <div onClick={()=>{Logout()}} className="navbar-user-data">
                        {CurrentUser?.profilepic && <img className='navbar-user-profile-picture' src={CurrentUser?.profilepic}></img>}
                        {CurrentUser && <p style={{pointerEvents:'none'}}>{CurrentUser?.username}</p>}

                        {CurrentUser ? (
                        <button className="navbar-button" onClick={Logout}>
                            <LogOut className='navbar-button-icon' size={15} /> 
                        </button>
                        ):
                            <button className="navbar-button" onClick={Logout}>
                                <LogIn className='navbar-button-icon' size={15} /> Login
                            </button>
                        }
                    </div>
                  
                   
                </div>
            </div>
        </>
    )
}
