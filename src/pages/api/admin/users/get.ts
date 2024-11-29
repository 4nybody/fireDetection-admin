// import { NextApiRequest, NextApiResponse } from "next";
// import { supabase } from "@/supabase/server";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { data, error } = await supabase.from("users").select("*");

//   if (error) return res.status(400).json({ error: error.message });

//   return res.status(200).json({ data });
// }
