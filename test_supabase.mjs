import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) env[key.trim()] = vals.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('reviews').insert({
    salon_id: '11111111-1111-1111-1111-111111111111',
    customer_id: '11111111-1111-1111-1111-111111111111',
    rating: 5,
    comment: 'test',
    author_name: 'test'
  });
  console.log("INSERT ERROR:", error);
}
check();
