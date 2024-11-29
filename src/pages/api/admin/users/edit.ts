// import { NextApiRequest, NextApiResponse } from "next";
// import { supabase } from "@/supabase/server";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "PUT") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { id, username, type } = req.body;

//   const { data, error } = await supabase
//     .from("users")
//     .update({ username, type })
//     .eq("id", id);

//   if (error) return res.status(400).json({ error: error.message });

//   return res.status(200).json({ data });
// }
