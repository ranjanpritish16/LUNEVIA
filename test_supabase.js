const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) env[key.trim()] = vals.join('=').trim().replace(/"/g, '').replace(/'/g, '').replace(/\r/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  console.log("Signing up test user...");
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: 'test_bot_user999@example.com',
    password: 'password123',
    options: { data: { full_name: 'Test Bot' } }
  });
  
  await supabase.auth.signInWithPassword({
    email: 'test_bot_user999@example.com',
    password: 'password123'
  });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return console.log("No user!");

  const { data: salons } = await supabase.from('salons').select('id, name, rating, review_count').limit(1);
  if (!salons || salons.length === 0) return;
  const salon = salons[0];
  
  console.log("Salon before insert:", salon);
  
  console.log("Inserting review...");
  const { data: revData, error: err2 } = await supabase.from('reviews').insert({
    salon_id: salon.id,
    customer_id: user.id,
    rating: 4,
    comment: 'test comment from bot',
    author_name: 'test user'
  });
  console.log("Insert Review Error:", err2);
  
  const { data: salons2 } = await supabase.from('salons').select('rating, review_count').eq('id', salon.id);
  console.log("Salon after insert review:", salons2);

  console.log("Inserting booking...");
  const { data: bookData, error: err3 } = await supabase.from('bookings').insert({
    salon_id: salon.id,
    customer_id: user.id,
    service_id: '11111111-1111-1111-1111-111111111111',
    booking_date: '2026-12-01',
    booking_time: '10:00',
    status: 'pending',
    total_price: 100,
    customer_name: 'Test Bot',
    customer_phone: '1234567890'
  });
  console.log("Insert Booking Error:", err3);
}
check();
