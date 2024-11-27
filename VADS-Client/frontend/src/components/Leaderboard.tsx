import React, { useState, useEffect } from "react";
import sort_by_icon from '../../src/assets/sort_by_icon.png'

interface User {
  _id: string;
  email: string;
  username: string;
  profilePic: string;
  total_flight_time: number;
  highest_altitude: number;
  total_distance: number;
  top_speed: number;
  __v: number;
}

export const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sortField, setSortField] = useState<keyof User>('total_flight_time');
  const [isAscending, setIsAscending] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSortFieldChange = (field: keyof User) => {
    setSortField(field);
  };

  const toggleSortOrder = () => {
    setIsAscending((prev) => !prev);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return isAscending ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  return (
    <div style={{ display: "flex", flexDirection: 'column', backgroundColor: '#D9D9D9', width: '44.65%', height: '92%', margin: '7px 0px 7px 12px', borderRadius: '20px 0px 0px 20px', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center', overflowY: 'auto' }}>
      {/* Sorting Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0px', marginTop: '20px', alignItems: 'center', marginLeft: '0px' }}>
        <div style={{ position: 'relative', marginRight: '360px' }}>
          <select id="sort-by" value={sortField} onChange={(e) => handleSortFieldChange(e.target.value as keyof User)} style={{ padding: '10px', cursor: 'pointer', borderRadius: '5px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', outline: 'none', fontFamily: 'Roboto Mono', fontWeight: '600' }}>
            <option value="total_flight_time">Total Flight Time</option>
            <option value="highest_altitude">Highest Altitude</option>
            <option value="total_distance">Total Distance</option>
            <option value="top_speed">Top Speed</option>
          </select>
        </div>
        <button onClick={toggleSortOrder} style={{ cursor: 'pointer', borderRadius: '5px', backgroundColor: 'transparent', border: 'none' }}>
          <img src={sort_by_icon} alt="Sort Order Icon" style={{ width: '40px', height: '40px', transition: '0.5s' , transform: isAscending ? 'scaleY(-1)' : 'scaleY(1)' }} />
        </button>
      </div>

      {/* User Rows */}
      <div style={{ display: "grid", gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', width: '90%', marginTop: '20px', marginBottom: '20px' }}>
        {sortedUsers.map((user) => (
          <div
            key={user._id}
            style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '10px', backgroundColor: '#FFFFFF', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <img src={user.profilePic} alt={`${user.username} profile`} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}/>
            <div>
              <div style={{ fontWeight: 'bold' }}>{user.username}</div>
              <div>{sortField.replace(/_/g, ' ')}: {user[sortField]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
