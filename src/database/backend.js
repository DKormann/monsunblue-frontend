import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://qkmbtddkxmlwkbnncszb.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODEzMTIxMCwiZXhwIjoxOTUzNzA3MjEwfQ.i5fv-1AWw0c6e5TF6rvGN5Sldweg0CHRslWbMA34Rk0"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export {supabase}
