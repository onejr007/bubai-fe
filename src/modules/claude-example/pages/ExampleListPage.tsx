import React from 'react';
import { useNavigate } from '@core/Router';

const ExampleListPage: React.FC = () => {
  const navigate = useNavigate();

  const items = [
    { id: 1, title: 'Item 1' },
    { id: 2, title: 'Item 2' },
    { id: 3, title: 'Item 3' },
  ];

  return (
    <div className="example-list">
      <h1>Example Module - List Page</h1>
      <p>This demonstrates how to create a module with routing</p>
      
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <button onClick={() => navigate(`/example/detail/${item.id}`)}>
              {item.title}
            </button>
          </li>
        ))}
      </ul>
      
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default ExampleListPage;
