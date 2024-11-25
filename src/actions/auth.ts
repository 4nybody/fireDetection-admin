'use server';

import { createClient } from "@/supabase/server";

export const authenticate = async (email: string, password: string) => {
	try {
		// console.log(email, password)
		const supabase = await createClient();

		const {error} = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw error;

	} catch (error) {
		console.log("AUTHENTICATION ERROR", error);
		throw error;
	}
};
