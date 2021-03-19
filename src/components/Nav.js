import React from 'react'
import { Link } from "react-router-dom";

const Nav = () => {
    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <Link to="/" class="navbar-brand">CNEMA</Link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <Link to="/movies" class="nav-link active" aria-current="page" >Movies</Link>
                        </li>
                        <li class="nav-item">
                            <Link to="/tv" class="nav-link" >TV</Link>
                        </li>
                    </ul>
                    <form class="d-flex">
                        <div className="search-wrapper d-flex align-items-center">
                            <input class="search me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button class="my-btn d-flex align-items-center" type="submit"><ion-icon className="my-icon" style={{ fontSize: 25, color: '#7A7A7A' }} name="search-outline"></ion-icon></button>
                        </div>
                    </form>
                </div>
            </div>
        </nav>
    )
}

export default Nav
