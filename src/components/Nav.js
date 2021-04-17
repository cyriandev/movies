import React, { useState } from 'react'
import { NavLink, useHistory } from "react-router-dom";

const Nav = () => {
    let history = useHistory();
    const [q, setq] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push(`/search?q=${q}`);
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <div className="navbar-brand d-flex align-items-center">
                    <ion-icon style={{ fontSize: 30 }} name="videocam"></ion-icon>

                </div >
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to="/movies" activeClassName='active' className="nav-link" aria-current="page" >Movies</NavLink >
                        </li>
                        <li className="nav-item">
                            <NavLink to="/tv" activeClassName='active' className="nav-link" >TV</NavLink >
                        </li>
                    </ul>
                    <form className="" onSubmit={handleSubmit}>
                        <div className="search-wrapper d-flex align-items-center">
                            <input className="search me-2" type="search" placeholder="Search" aria-label="Search" value={q} onChange={(e) => setq(e.target.value)} />
                            <button className="my-btn d-flex align-items-center" type="submit"><ion-icon className="my-icon" style={{ fontSize: 25, color: '#7A7A7A' }} name="search-outline"></ion-icon></button>
                        </div>
                    </form>
                </div>
            </div>
        </nav>
    )
}

export default Nav
