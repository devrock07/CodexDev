import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISnippet extends Document {
    title: string;
    description: string;
    code: string;
    language: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const SnippetSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        code: { type: String, required: true },
        language: { type: String, default: 'javascript' },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);

// Check if model already exists to prevent overwrite error in hot reload
const Snippet: Model<ISnippet> = mongoose.models.Snippet || mongoose.model<ISnippet>('Snippet', SnippetSchema, 'codex_snippets');

export default Snippet;
