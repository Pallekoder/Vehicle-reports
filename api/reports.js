// api/reports.js
import { supabase } from '../lib/supabaseClient'; // Import Supabase client

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { report } = req.body;

    // Insert the new report into the Supabase database
    const { data, error } = await supabase
      .from('reports') // Name of the table in Supabase
      .insert([{ report }]);

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(201).json(data);
    }
  } else if (req.method === 'GET') {
    // Retrieve all reports from the Supabase database
    const { data, error } = await supabase
      .from('reports')
      .select('*');

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(data);
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
