import { TagForm } from "@/components/tag-form";

export default function CreateTagPage() {
    return (
        <div className="container py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Create Tag</h1>
            <TagForm />
        </div>
    )
}
