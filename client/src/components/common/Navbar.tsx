import { Link, useNavigate } from "react-router"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoIosLogOut } from "react-icons/io";
import useLogout from "../../hooks/useLogout";
import useUser from "../../hooks/useUser";

const Navbar = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { logoutMutate, isPending: isLogoutPending } = useLogout();

  const handleOnClick = () => {
    logoutMutate();
  }
  return (
    <nav className='flex justify-between items-center p-2 md:p-4 bg-primary text-white w-full'>
      {(user) ? (<div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer-4" className="drawer-button btn btn-ghost btn-secondary"><GiHamburgerMenu /> Welcome, {user?.name}</label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content text-lg min-h-full w-80 p-4">
            <h3 className="text-lg font-bold mb-2 ml-3">Dashboard</h3>
            <li><Link to="/dashboard">Profile</Link></li>
            <li><Link to="/dashboard/my-files">My Files</Link></li>
            <li><Link to="/dashboard/upload-file">Upload File</Link></li>
            <li><Link to="/dashboard/public-files">Public Files</Link></li>
            <div className="divider"></div>
            {
              user.role === 'admin' && (<>
                <h3 className="text-lg font-bold mb-2 ml-3">Admin</h3>
                <li><Link to="/dashboard/admin/users">Manage Users</Link></li>
                <li><Link to="/dashboard/admin/files">Manage Files</Link></li>
                <li><Link to="/dashboard/admin/stats">Storage Statistics</Link></li>
                <div className="divider"></div>
              </>)
            }
            <li><Link to="/dashboard/theme">Change Theme</Link></li>
            <li><button onClick={handleOnClick} className='btn btn-ghost btn-warning text-left btn-lg flex justify-between' disabled={isLogoutPending}>Logout <IoIosLogOut /></button></li>
          </ul>
        </div>
      </div>) : (
        <div className='flex gap-x-2'>
          <button onClick={() => navigate('/login')} className='btn btn-soft btn-active'>Login</button>
          <button onClick={() => navigate('/register')} className='btn btn-soft btn-secondary btn-active'>Register</button>
        </div>
      )}
      <Link to="/"><div className='font-bold text-sm md:text-xl flex gap-x-2 items-center'>
        <p>Vaultify</p> 
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 100 100" 
          className="fill-current text-white"
        >
          {/* Main vault circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4"
            className="opacity-80"
          />
          
          {/* Inner security ring */}
          <circle 
            cx="50" 
            cy="50" 
            r="32" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="opacity-60"
          />
          
          {/* File/folder icon centered */}
          <path 
            d="M35 40 L45 40 L48 36 L65 36 L65 64 L35 64 Z" 
            fill="currentColor"
            className="opacity-90"
          />
          
          {/* File content lines */}
          <line x1="40" y1="45" x2="60" y2="45" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
          <line x1="40" y1="50" x2="55" y2="50" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
          <line x1="40" y1="55" x2="58" y2="55" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
          
          {/* Lock icon positioned at bottom right */}
          <circle 
            cx="65" 
            cy="65" 
            r="8" 
            fill="currentColor"
            className="opacity-95"
          />
          <rect 
            x="61" 
            y="68" 
            width="8" 
            height="6" 
            rx="1" 
            fill="rgba(255,255,255,0.9)"
          />
          <path 
            d="M63 68 C63 66 64 65 65 65 C66 65 67 66 67 68" 
            fill="none" 
            stroke="rgba(255,255,255,0.9)" 
            strokeWidth="1.5"
          />
          
          {/* Vault dial markers */}
          <circle cx="25" cy="50" r="1.5" fill="currentColor" className="opacity-70"/>
          <circle cx="75" cy="50" r="1.5" fill="currentColor" className="opacity-70"/>
          <circle cx="50" cy="25" r="1.5" fill="currentColor" className="opacity-70"/>
        </svg>
      </div></Link>
    </nav>
  )
}

export default Navbar