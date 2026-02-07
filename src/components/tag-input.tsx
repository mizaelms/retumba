"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createTag } from "@/app/actions/tags"
import { X, Plus } from "lucide-react"

interface TagInputProps {
    availableTags: { id: number; name: string }[];
    selectedTagIds: number[];
    onTagsChange: (ids: number[]) => void;
    onTagCreated: (newTag: { id: number; name: string, slug: string }) => void;
}

export function TagInput({ availableTags, selectedTagIds, onTagsChange, onTagCreated }: TagInputProps) {
    const [inputValue, setInputValue] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    const selectedTags = availableTags.filter(tag => selectedTagIds.includes(tag.id))
    const unselectedTags = availableTags.filter(tag => !selectedTagIds.includes(tag.id) && tag.name.toLowerCase().includes(inputValue.toLowerCase()))

    const handleSelect = (id: number) => {
        onTagsChange([...selectedTagIds, id])
        setInputValue("")
    }

    const handleUnselect = (id: number) => {
        onTagsChange(selectedTagIds.filter(tid => tid !== id))
    }

    const handleCreate = async () => {
        if (!inputValue.trim()) return
        setIsCreating(true)
        try {
            const slug = inputValue.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            const result = await createTag({ name: inputValue, slug })
            if (result.success && result.tag) {
                onTagCreated(result.tag)
                onTagsChange([...selectedTagIds, result.tag.id])
                setInputValue("")
            }
        } catch (error) {
            console.error(error)
            alert("Failed to create tag")
        } finally {
            setIsCreating(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            e.stopPropagation() // Prevent form submission
            // Check if tag already exists exactly
            const existing = availableTags.find(t => t.name.toLowerCase() === inputValue.toLowerCase())
            if (existing) {
                if (!selectedTagIds.includes(existing.id)) {
                    handleSelect(existing.id)
                }
            } else {
                handleCreate()
            }
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map(tag => (
                    <Badge key={tag.id} variant="secondary" className="pl-2 pr-1 h-7">
                        {tag.name}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1 hover:bg-transparent text-muted-foreground hover:text-foreground"
                            onClick={() => handleUnselect(tag.id)}
                            type="button"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                ))}
            </div>

            <div className="flex gap-2">
                <Input
                    placeholder="Search or create tag..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleCreate} disabled={!inputValue || isCreating}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                </Button>
            </div>

            {inputValue && (
                <div className="border rounded-md p-2 max-h-[150px] overflow-y-auto bg-popover text-popover-foreground">
                    {unselectedTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {unselectedTags.map(tag => (
                                <Badge
                                    key={tag.id}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-secondary"
                                    onClick={() => handleSelect(tag.id)}
                                >
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground p-2">
                            No existing tags match. Press Enter to create "{inputValue}".
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
