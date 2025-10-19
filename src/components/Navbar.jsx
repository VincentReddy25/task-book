import { Link, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Profile from './Profile';

export default function Navbar() {
    return (
        <>
            <div className="navbar">
                <Link to='/dashboard'>Dashboard</Link>
                <Link to='/profile'>Profile</Link>
                {/* <Link to='/logout'>Logout</Link> */}
            </div>

            <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/profile' element={<Profile />} />
            </Routes>
        </>
    );
}
