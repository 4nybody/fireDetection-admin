// 'use server'
// import { NextApiRequest, NextApiResponse } from "next";
// import { supabase } from "@/supabase/server";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "DELETE") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { id } = req.body;

//   const { data, error } = await supabase.from("users").delete().eq("id", id);

//   if (error) return res.status(400).json({ error: error.message });

//   return res.status(200).json({ data });
// }
