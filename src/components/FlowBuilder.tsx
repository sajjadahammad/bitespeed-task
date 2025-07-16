import type React from "react"
import { useState, useRef, useCallback } from "react"
import  {
    
ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  type Connection,
  type Edge,
  type Node,
  useReactFlow,
  BackgroundVariant,
} from "@xyflow/react"
import { nanoid } from "nanoid"
import { Toaster,toast } from "sonner"

import MessageNode from "./MessageNode"
import NodesPanel from "./NodePanel"
import SettingsPanel from "./SettingsPanel"
import { Button } from "@/components/ui/button"

// Define custom node types
const nodeTypes = { messageNode: MessageNode }

// Initial nodes for demonstration
const initialNodes: Node[] = [
  {
    id: "1",
    type: "messageNode",
    position: { x: 250, y: 5 },
    data: { message: "test message 1" },
  },
  {
    id: "2",
    type: "messageNode",
    position: { x: 250, y: 200 },
    data: { message: "test message 2" },
  },
]

// Initial edges for demonstration
const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }]

export default function FlowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const { screenToFlowPosition } = useReactFlow()

  // Callback for connecting nodes with an edge
  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  // Callback for handling drag over event when adding a new node
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  // Callback for handling drop event when adding a new node
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")

      // Check if the dropped item is a valid node type
      if (typeof type === "string" && type === "messageNode") {
        // Calculate the position of the new node
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })

        // Create a new node object
        const newNode = {
          id: nanoid(), // Generate a unique ID for the new node
          type,
          position,
          data: { message: "New Message" }, // Default message for new nodes
        }

        // Add the new node to the existing nodes
        setNodes((nds) => nds.concat(newNode))
      }
    },
    [setNodes, screenToFlowPosition],
  )

  // Callback for when a node is clicked
  const onNodeClick = useCallback(( node: Node) => {
    setSelectedNode(node)
  }, [])

  // Callback for when the pane is clicked (to deselect nodes)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // Callback to update the message of a specific node
  const onMessageChange = useCallback(
    (nodeId: string, newMessage: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: { ...node.data, message: newMessage },
              }
            : node,
        ),
      )
    },
    [setNodes],
  )

  // Function to handle saving the flow with validation
  const onSave = useCallback(() => {
    if (nodes.length <= 1) {
      // If there's 0 or 1 node, validation passes automatically
      toast.success("Flow saved successfully!")
      console.log("Flow saved:", { nodes, edges })
      return
    }

    // Create a set of all node IDs that are targets of an edge
    const targetNodeIds = new Set(edges.map((edge) => edge.target))

    let nodesWithEmptyTargetHandlesCount = 0
    // Iterate through all nodes to find those with no incoming edges
    for (const node of nodes) {
      if (!targetNodeIds.has(node.id)) {
        nodesWithEmptyTargetHandlesCount++
      }
    }

    // Validation logic: "more than one Nodes and more than one Node has empty target handles"
    if (nodes.length > 1 && nodesWithEmptyTargetHandlesCount > 1) {
      toast.error("Error: More than one node has an empty target handle. Please connect them.")
    } else {
      toast.success("Flow saved successfully!")
      console.log("Flow saved:", { nodes, edges })
    }
  }, [nodes, edges])

  return (
    <div className="flex h-screen w-full">
      <Toaster position="bottom-right" /> {/* Toaster for displaying notifications */}
      <div className="flex-grow h-full" ref={reactFlowWrapper}>
        <div className="absolute top-4 right-4 z-10">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_event, node) => onNodeClick(node)}
          onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes} // Register custom node types
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
  
        >
          <MiniMap /> {/* Mini-map for navigation */}
          <Controls /> {/* Controls for zoom, pan, etc. */}
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} /> {/* Dotted background */}
        </ReactFlow>
      </div>
      {/* Conditionally render SettingsPanel or NodesPanel */}
      {selectedNode ? <SettingsPanel selectedNode={selectedNode} onMessageChange={onMessageChange} /> : <NodesPanel />}
    </div>
  )
}
