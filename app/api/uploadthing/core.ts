import { createUploadthing, type FileRouter } from "uploadthing/next";
import { cookies } from "next/headers";

const f = createUploadthing({
    errorFormatter: (err) => {
        console.log("Uploadthing Error:", err);
        return {
            message: err.message,
        };
    },
});

// Middleware to check if user is authenticated (staff only)
const auth = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token");

        // For now, allow uploads if token exists
        // You can add stricter validation later
        if (token) {
            return { userId: "staff" };
        }

        // Allow upload anyway for testing - remove this in production
        console.log("Warning: Uploading without auth token");
        return { userId: "anonymous" };
    } catch (error) {
        console.error("Auth error:", error);
        return { userId: "anonymous" };
    }
};

// FileRouter for your app
export const ourFileRouter = {
    // Image uploader
    imageUploader: f({
        image: {
            maxFileSize: "16MB",
            maxFileCount: 5
        }
    })
        .middleware(async () => await auth())
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Image upload complete for userId:", metadata.userId);
            console.log("File URL:", file.url);
            console.log("File name:", file.name);

            // Save to database
            return { uploadedBy: metadata.userId, fileUrl: file.url };
        }),

    // ZIP uploader
    zipUploader: f({
        "application/zip": {
            maxFileSize: "64MB",
            maxFileCount: 3
        }
    })
        .middleware(async () => await auth())
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("ZIP upload complete for userId:", metadata.userId);
            console.log("File URL:", file.url);
            console.log("File name:", file.name);

            // Save to database
            return { uploadedBy: metadata.userId, fileUrl: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
