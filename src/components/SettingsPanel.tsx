
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Node } from "@xyflow/react"
import { useEffect, useState } from "react"

interface SettingsPanelProps {
    selectedNode: Node | null
    onMessageChange: (nodeId: string, newMessage: string) => void
}

export default function SettingsPanel({ selectedNode, onMessageChange }: SettingsPanelProps) {
    const [message, setMessage] = useState(selectedNode?.data?.message || "")

    useEffect(() => {
        if (selectedNode) {
            setMessage(selectedNode.data?.message ?? "");
        }
    }, [selectedNode]);
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMessage = event.target.value
        setMessage(newMessage)
        if (selectedNode) {
            onMessageChange(selectedNode.id, newMessage)
        }
    }

    if (!selectedNode) {
        return (
            <div className="p-4 border-l bg-gray-50 h-full flex flex-col gap-4 w-80">
                <h2 className="text-lg font-semibold mb-2">Settings Panel</h2>
                <p className="text-sm text-gray-500">Select a node to view its settings.</p>
            </div>
        )
    }
    return (
        <div className="p-4 border-l bg-gray-50 h-full flex flex-col gap-4 w-80">
            <h2 className="text-lg font-semibold mb-2">Settings Panel</h2>
            <Card>
                <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-sm font-medium">Edit Message</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                    <Label htmlFor="node-message" className="sr-only">
                        Node Message
                    </Label>
                    <Textarea
                        id="node-message"
                        value={typeof message === "string" ? message : ""}
                        onChange={handleChange}
                        placeholder="Enter message for the node"
                        className="min-h-[80px]"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
