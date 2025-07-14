import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"




export default function MessageNode({ data, selected }: NodeProps) {
  return (
    <Card className={`w-64 shadow-md ${selected ? "border-2 border-blue-500" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1">
        <MessageSquare className="h-4 w-4 text-gray-500" />
        Send Message
      </CardTitle>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        className="w-3 h-3 bg-blue-500 rounded-full border-none"
      />
    </CardHeader>
    <CardContent className="p-3 pt-0 text-sm text-gray-700">
      <p className="whitespace-pre-wrap">
        {typeof data.message === "string" ? data.message : ""}
      </p>
    </CardContent>
    <Handle
      type="target"
      position={Position.Top}
      id="b"
      className="w-3 h-3 bg-green-500 rounded-full border-none"
    />
  </Card>
  )
}
