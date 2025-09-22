import { Outlet } from 'react-router'

const Layout = () => {
  return (
    <div className='flex-grow flex'>
        <Outlet />
    </div>
  )
}

export default Layout