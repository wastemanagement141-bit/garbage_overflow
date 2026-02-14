import { supabase } from '../../lib/supabaseClient.js';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    let deviceIdToDelete = null;

    if (id.startsWith('temp-')) {
        // Handle discovered but unregistered bin
        deviceIdToDelete = id.replace('temp-', '');
    } else {
        // Handle registered bin
        const { data: binRecord, error: fetchError } = await supabase
            .from('dustbin_registry')
            .select('deviceid')
            .eq('id', id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
            return res.status(500).json({ error: fetchError.message });
        }

        if (binRecord) {
            deviceIdToDelete = binRecord.deviceid;
            // Delete from registry
            const { error: regDeleteError } = await supabase
                .from('dustbin_registry')
                .delete()
                .eq('id', id);

            if (regDeleteError) {
                return res.status(500).json({ error: regDeleteError.message });
            }
        }
    }

    // Trigger linked datas: Delete all history from 'bins' table
    if (deviceIdToDelete) {
        const { error: binsDeleteError } = await supabase
            .from('bins')
            .delete()
            .eq('deviceid', deviceIdToDelete);

        if (binsDeleteError) {
            return res.status(500).json({ error: binsDeleteError.message });
        }
    }

    return res.status(200).json({ success: true, deviceId: deviceIdToDelete });
}
