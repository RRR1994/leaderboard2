
import { LeaderboardEntry } from './types';

const generateInitialData = (): LeaderboardEntry[] => {
  const elite = [
    { id: '1', name: 'James Anderson', amount: 5.00, timestamp: Date.now() - 100000, message: "View from the top is quiet.", mediaUrl: "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?w=800&auto=format&fit=crop&q=60" },
    { id: '2', name: 'Sarah Miller', amount: 4.85, timestamp: Date.now() - 95000, message: "Hard work pays off." },
    { id: '3', name: 'Robert Taylor', amount: 4.50, timestamp: Date.now() - 90000 },
    { id: '4', name: 'Emma Wilson', amount: 4.25, timestamp: Date.now() - 85000 },
    { id: '5', name: 'Michael Brown', amount: 4.10, timestamp: Date.now() - 80000 },
    { id: '6', name: 'Olivia Davies', amount: 3.90, timestamp: Date.now() - 75000 },
    { id: '7', name: 'William Evans', amount: 3.75, timestamp: Date.now() - 70000 },
    { id: '8', name: 'Sophia Thomas', amount: 3.50, timestamp: Date.now() - 65000 },
    { id: '9', name: 'David Roberts', amount: 3.25, timestamp: Date.now() - 60000 },
    { id: '10', name: 'Isabella Johnson', amount: 3.00, timestamp: Date.now() - 55000 },
    { id: '11', name: 'Richard Walker', amount: 2.75, timestamp: Date.now() - 50000 },
    { id: '12', name: 'Mia White', amount: 2.50, timestamp: Date.now() - 45000 },
    { id: '13', name: 'Joseph Thompson', amount: 2.25, timestamp: Date.now() - 40000 },
    { id: '14', name: 'Charlotte Harris', amount: 2.00, timestamp: Date.now() - 35000 },
    { id: '15', name: 'Thomas Martin', amount: 1.75, timestamp: Date.now() - 30000 },
    { id: '16', name: 'Amelia King', amount: 1.50, timestamp: Date.now() - 25000 },
    { id: '17', name: 'Charles Lee', amount: 1.25, timestamp: Date.now() - 20000 },
    { id: '18', name: 'Emily Scott', amount: 1.00, timestamp: Date.now() - 15000 },
    { id: '19', name: 'Christopher Green', amount: 0.85, timestamp: Date.now() - 10000 },
    { id: '20', name: 'Jessica Baker', amount: 0.75, timestamp: Date.now() - 5000 },
    { id: '21', name: 'Daniel Adams', amount: 0.50, timestamp: Date.now() - 4000 },
    { id: '22', name: 'Lily Campbell', amount: 0.40, timestamp: Date.now() - 3000 },
    { id: '23', name: 'Matthew Nelson', amount: 0.30, timestamp: Date.now() - 2000 },
    { id: '24', name: 'Grace Carter', amount: 0.20, timestamp: Date.now() - 1000 },
    { id: '25', name: 'Anthony Mitchell', amount: 0.15, timestamp: Date.now() - 500 },
    { id: '26', name: 'Chloe Perez', amount: 0.10, timestamp: Date.now() - 200 },
    { id: '27', name: 'Mark Roberts', amount: 0.05, timestamp: Date.now() - 100 },
    { id: '28', name: 'Lucy Gray', amount: 0.01, timestamp: Date.now() - 50 },
  ];

  const totalDesired = 200;
  const data = [...elite];

  for (let i = 29; i <= totalDesired; i++) {
    // Scaling amount from 0.01 down to 0.005
    const amount = Math.max(0.005, 0.01 - (i * 0.00002));
    data.push({
      id: i.toString(),
      name: `User ${i}`, 
      amount: amount,
      timestamp: Date.now() - (i * 1000),
    });
  }

  return data;
};

export const INITIAL_DATA: LeaderboardEntry[] = generateInitialData();

export const COLORS = {
  gold: '#D4AF37',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};
