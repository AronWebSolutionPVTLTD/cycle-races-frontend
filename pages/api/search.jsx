// import { riders } from '../../data/riders';

// export default function handler(req, res) {
//   const { q } = req.query;
  
//   if (!q) {
//     return res.status(400).json({ error: 'Query parameter is required' });
//   }

//   const results = riders.filter(rider => 
//     rider.name.toLowerCase().includes(q.toLowerCase())
//   ).slice(0, 5);

//   res.status(200).json(results);
// }