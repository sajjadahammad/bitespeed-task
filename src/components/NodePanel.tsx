import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function NodesPanel() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="p-4 border-l bg-gray-50 h-full flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2">Nodes Panel</h2>
      <Card
        className="cursor-grab active:cursor-grabbing"
        onDragStart={(event) => onDragStart(event, "messageNode")}
        draggable
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-gray-500" />
            Message
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-sm text-gray-700">
          <p>Drag this to add a new message node.</p>
        </CardContent>
      </Card>
      {/* Future nodes can be added here, making the panel extensible */}
    </div>
  )
}
