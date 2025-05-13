import { Link } from 'react-router-dom'
import { FilePlus2, FileMinus2, FileStack, User} from 'lucide-react'
export default function ControlPanel(){


    return(
        <>
            <div className='control-panel-container'>

                <Link to={"/invoices"} className='control-panel-input'>
                    <FileStack size={20} stroke='black' className='input-icon'/>
                    <p className='input-text'>Invoices</p>
                </Link>

                <Link to={"/addinvoice"} className='control-panel-input'>
                    <FilePlus2 stroke='black' size={20} className='input-icon'/>
                    <p className='input-text'>New</p>
                </Link>

                <Link to={"/signin"} className='control-panel-input'>
                    <User size={20}stroke='black'  className='input-icon'/>
                    <p className='input-text'>User</p>
                </Link>
                
            </div>
        
        </>
    )
}