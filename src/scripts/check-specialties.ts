import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
    // Check for maréchaux-ferrants
    const { data: marechaux, error: err1 } = await supabase
        .from('practitioners')
        .select('id, name, specialty, status')
        .or('specialty.ilike.%maréchal%,specialty.ilike.%marechal%,specialty.ilike.%ferrant%');

    console.log('=== Maréchaux-ferrants ===');
    console.log('Count:', marechaux?.length || 0);
    if (err1) console.log('Error:', err1.message);
    marechaux?.slice(0, 15).forEach(p => console.log(`  - ${p.name} | "${p.specialty}" | ${p.status}`));

    // Check for vétérinaires
    const { data: vets, error: err2 } = await supabase
        .from('practitioners')
        .select('id, name, specialty, status')
        .or('specialty.ilike.%vétérinaire%,specialty.ilike.%veterinaire%');

    console.log('\n=== Vétérinaires ===');
    console.log('Count:', vets?.length || 0);
    if (err2) console.log('Error:', err2.message);
    vets?.slice(0, 15).forEach(p => console.log(`  - ${p.name} | "${p.specialty}" | ${p.status}`));

    // Get ALL unique specialties
    console.log('\n=== All unique specialties ===');
    const { data: all } = await supabase
        .from('practitioners')
        .select('specialty');

    const unique = new Set(all?.map(p => p.specialty).filter(Boolean));
    console.log('Unique values:', Array.from(unique));
}

check();
