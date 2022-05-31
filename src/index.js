import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AdminDashboard from './Admin/Dashboard'
import AddItem from './Admin/ItemsAdd'
import EditItem from './Admin/ItemsEdit'
import Items from './Admin/Items'
import Members from './Admin/Members'
import Reports from './Admin/Reports'
import Item from './Item'
import SecureRoute from './components/SecureRoute';
import Login from './Login';
import SignUp from './SignUp';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

  <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login /> }/>
        <Route path="/signup" element={<SignUp /> }/>
        <Route path="/admin" element={<AdminDashboard /> }/>
        <Route path="/admin/items" element={<Items />} />
        <Route path="/admin/items/add" element={<AddItem />} />
        <Route path="/admin/items/:id" element={<EditItem />} />
        <Route path="/admin/members" element={<Members />} />
        <Route path="/admin/Reports" element={<Reports />} />
        <Route path="/item/:id" element={
           <SecureRoute>
              <Item />
           </SecureRoute>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
