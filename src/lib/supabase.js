import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kutozxmqorultccxofkw.supabase.co';
const supabaseKey = 'sb_publishable_CiKP-gOZzSV1nSX-X9_NLA_JBx7Wxq8';

export const supabase = createClient(supabaseUrl, supabaseKey);
