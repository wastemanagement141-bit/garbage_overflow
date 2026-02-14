import { supabase } from '../../lib/supabaseClient.js';

export default async function handler(req, res) {
    // Return last 20 records
    const { deviceId } = req.query;

    let query = supabase
        .from('bins')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(20);

    if (deviceId) {
        query = query.eq('deviceId', deviceId);
    }

    const { data, error } = await query;

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
}
