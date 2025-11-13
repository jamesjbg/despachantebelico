import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grkwcdmfctwwlisftqjc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3djZG1mY3R3d2xpc2Z0cWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3Mjc5OTcsImV4cCI6MjA3ODMwMzk5N30.m4S2ffaIs7-ONMinEeyO9yQcqSZ8DCbUlrD9mLMiQHU';

export const supabase = createClient(supabaseUrl, supabaseKey);