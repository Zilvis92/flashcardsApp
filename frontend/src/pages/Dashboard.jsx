import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Mano kortelių rinkiniai</h1>
      <p>Čia bus tavo flashcards sąrašas, kurį gausime iš API.</p>
      
      <div>
        <button onClick={() => alert('Kurti naują rinkinį...')}>+ Sukurti rinkinį</button>
        <button onClick={logout}>
          Atsijungti
        </button>
      </div>
    </div>
  );
};

export default Dashboard;