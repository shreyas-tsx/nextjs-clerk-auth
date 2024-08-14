import React from 'react';
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

const AuthCallbackPage = async () => {
    
    const user = await currentUser();

    if (!user?.id || !user?.primaryEmailAddress?.emailAddress) {
        return redirect("/sign-in");
    }

    const dbUser = await db.user.findFirst({
        where: {
            clerkId: user.id,
        },
    });

    if (!dbUser) {
        await db.user.create({
            data: {
                id: user.id,
                clerkId: user.id,
                email: user.primaryEmailAddress.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });

        // this is the path where user will redirect after successful login
        return redirect("/dashboard");
    } else {
        return redirect("/");
    }
};

export default AuthCallbackPage
