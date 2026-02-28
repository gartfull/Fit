import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmkgzxroywiezrmjonmx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNta2d6eHJveXdpZXpybWpvbm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzM3MDAsImV4cCI6MjA4Nzg0OTcwMH0.W5CPItW2z2WtBZiI8feN4zHGoLEeKl2F58MA2hcY58s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
