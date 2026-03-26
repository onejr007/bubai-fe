import React from 'react';
import { useParams, useNavigate } from '@core/Router';

const ExampleDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="example-detail">
      <h1>Example Detail Page</h1>
      <p>Viewing item with ID: {id}</p>
      
      <button onClick={() => navigate('/example')}>Back to List</button>
    </div>
  );
};

export default ExampleDetailPage;
