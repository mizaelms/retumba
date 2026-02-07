import { CategoryForm } from "@/components/category-form";

export default function CreateCategoryPage() {
    return (
        <div className="container py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Create Category</h1>
            <CategoryForm />
        </div>
    )
}
