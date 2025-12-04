
import { createClient } from '@supabase/supabase-js';

// NOTA: Em um projeto Vite real, use import.meta.env.VITE_SUPABASE_URL
// Em Create React App, use process.env.REACT_APP_SUPABASE_URL
// Abaixo estou usando process.env conforme seu padrão, mas certifique-se que o bundler suporta.

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hcaxhibanbkdznqlzpmq.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjYXhoaWJhbmJrZHpucWx6cG1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3Njg4NjIsImV4cCI6MjA3OTM0NDg2Mn0.tcCCOgYRNW-uA6LYLskiLUr6j_RjizBy0cF7XdXdTLM';

export const supabase = createClient(supabaseUrl, supabaseKey);
