import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kutozxmqorultccxofkw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dG96eG1xb3J1bHRjY3hvZmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTUwMDAsImV4cCI6MjA4NTM5MTAwMH0.U3-1XsRro0OzSq-5phZb71GEPj5GEULxdbnAQMDqXEM';

export const supabase = createClient(supabaseUrl, supabaseKey);
