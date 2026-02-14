import { supabase } from '../../lib/supabaseClient.js';

export default async function handler(req, res) {
    // Get latest status
    // Optional: filter by deviceId query param ?deviceId=BIN001
    const { deviceId } = req.query;

    let query = supabase
        .from('bins')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(1);

    if (deviceId) {
        query = query.eq('deviceId', deviceId);
    }

    const { data, error } = await query;

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (data && data.length > 0) {
        return res.status(200).json(data[0]);
    } else {
        // Return default/empty state if no data found
        return res.status(200).json({
            message: 'No data found',
            fillPercentage: 0,
            status: 'EMPTY',
            deviceId: deviceId || 'UNKNOWN'
        });
    }
}
