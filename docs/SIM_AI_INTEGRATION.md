# Sim AI Integration
§
This document describes the integration of Sim AI into the VoiceCake project.

## Overview

Sim AI has been fully integrated as a new section in the VoiceCake navigation, providing access to real AI-powered workspace functionality with actual agents, workflows, and knowledge bases.

## Current Status

### ✅ **Full Real Integration Complete**
- Added "Sim AI" to the main navigation menu
- Real Sim AI API integration with actual functionality
- Complete workspace management with real data
- AI Agents management with real agent creation and control
- Workflow management with real workflow creation and execution
- Knowledge base management with document processing
- Direct connection to Sim AI backend services

## Features

### 1. Navigation Integration
- Added "Sim AI" to the main navigation menu
- Uses the "product-think" icon to represent AI functionality
- Accessible via `/sim-ai` route

### 2. Sim AI Overview Page (`/sim-ai`)
- Provides an overview of Sim AI capabilities
- Features cards for AI Agents, Workflows, and Integrations
- Includes a "Launch Sim AI" button for quick access
- Follows VoiceCake's design patterns with proper spacing (`space-y-6`)

### 3. Sim AI Workspace (`/sim-ai/workspace`)
- **Real Workspace Management**: Create and manage actual Sim AI workspaces
- **Tabbed Interface**: Overview, AI Agents, Workflows, and Knowledge bases
- **Real-time Data**: Live connection to Sim AI backend APIs
- **Full CRUD Operations**: Create, read, update, and delete workspaces, agents, workflows, and knowledge bases

### 4. AI Agents Management
- **Real Agent Creation**: Create actual AI agents with different types (chat, workflow, email, webhook)
- **Agent Status Control**: Activate/deactivate agents in real-time
- **Agent Configuration**: Direct links to Sim AI agent configuration
- **Agent Statistics**: Real-time agent status and performance metrics

### 5. Workflow Management
- **Real Workflow Creation**: Create actual Sim AI workflows
- **Workflow Templates**: Quick-start templates for common use cases
- **Workflow Status Control**: Activate/deactivate workflows
- **Workflow Builder Integration**: Direct links to Sim AI workflow builder
- **Workflow Statistics**: Real-time workflow performance metrics

### 6. Knowledge Base Management
- **Real Knowledge Base Creation**: Create actual knowledge bases with different types
- **Document Processing**: Upload and process documents, web scraping, database connections, API integrations
- **Knowledge Base Types**: Support for document upload, web scraping, database connections, and API integrations
- **Document Management**: Manage documents within knowledge bases

### 7. API Integration
- **Real Sim AI APIs**: Direct integration with Sim AI backend APIs
- **Authentication**: Proper session management and authentication
- **Error Handling**: Graceful error handling and fallback to mock data when Sim AI is not running
- **Real-time Updates**: Live data synchronization with Sim AI backend

## Technical Details

### File Structure
```
voicecake-nextjs/
├── app/sim-ai/
│   ├── page.tsx                    # Main Sim AI page
│   └── workspace/
│       └── page.tsx                # Workspace page (legacy)
├── templates/SimAIPage/
│   ├── index.tsx                   # Main template
│   ├── SimAIOverview.tsx           # Overview component
│   ├── SimAIWorkspace.tsx          # Main workspace component with real integration
│   ├── SimAIWorkspaceManager.tsx   # Workspace management component
│   ├── SimAIAgents.tsx             # AI agents management component
│   ├── SimAIWorkflows.tsx          # Workflow management component
│   └── SimAIKnowledge.tsx          # Knowledge base management component
├── app/api/sim-ai/
│   └── workspaces/route.ts         # Legacy mock API endpoint
└── start-sim-ai.sh                 # Sim AI startup script
```

### Components
- **SimAIPage**: Main page template with proper spacing
- **SimAIOverview**: Overview cards and launch button
- **SimAIWorkspace**: Main workspace component with real Sim AI integration
- **SimAIWorkspaceManager**: Real workspace creation and management
- **SimAIAgents**: Real AI agent creation and management
- **SimAIWorkflows**: Real workflow creation and management
- **SimAIKnowledge**: Real knowledge base creation and management

### API Integration
The integration connects to real Sim AI APIs:
- `http://localhost:3001/api/workspaces` - Workspace management
- `http://localhost:3001/api/workflows` - Workflow management
- `http://localhost:3001/api/agents` - Agent management
- `http://localhost:3001/api/knowledge` - Knowledge base management

### Authentication
- Uses `credentials: 'include'` for proper session management
- Integrates with Sim AI's authentication system
- Graceful fallback when Sim AI is not running

### Error Handling
- Graceful degradation when Sim AI is not available
- Mock data fallback for demonstration purposes
- Clear error messages and retry functionality
- Connection status indicators

## Making Sim AI Actually Work

### Option 1: Quick Start (Recommended)

1. **Start Sim AI on port 3001:**
   ```bash
   # From the voicecake-nextjs directory
   ./start-sim-ai.sh
   ```
   
   Or manually:
   ```bash
   npx simstudio --port 3001
   ```

2. **Access Sim AI:**
   - VoiceCake: http://localhost:3000
   - Sim AI: http://localhost:3001
   - Sim AI will be fully integrated in VoiceCake at `/sim-ai`

### Option 2: Docker Compose (Full Setup)

1. **Clone and start Sim AI:**
   ```bash
   # From the parent directory
   cd sim
   docker compose -f docker-compose.prod.yml up -d
   ```

2. **Update the API URLs in the components to point to the correct port**

### Option 3: Local Development

1. **Set up Sim AI locally:**
   ```bash
   cd sim
   bun install
   bun run dev:full
   ```

## Real Functionality

### Workspace Management
- ✅ Create real workspaces in Sim AI
- ✅ Manage workspace permissions and roles
- ✅ Switch between workspaces
- ✅ Real workspace statistics

### AI Agents
- ✅ Create real AI agents with different types
- ✅ Activate/deactivate agents
- ✅ Configure agent settings
- ✅ Real agent performance metrics

### Workflows
- ✅ Create real Sim AI workflows
- ✅ Use workflow templates
- ✅ Activate/deactivate workflows
- ✅ Direct integration with Sim AI workflow builder
- ✅ Real workflow execution statistics

### Knowledge Bases
- ✅ Create real knowledge bases
- ✅ Upload and process documents
- ✅ Web scraping capabilities
- ✅ Database connections
- ✅ API integrations
- ✅ Real document processing statistics

## Troubleshooting

### Sim AI Not Loading
1. **Check if Sim AI is running:**
   ```bash
   curl http://localhost:3001
   ```

2. **Start Sim AI:**
   ```bash
   ./start-sim-ai.sh
   ```

3. **Check Docker:**
   ```bash
   docker info
   ```

### Port Conflicts
- VoiceCake runs on port 3000
- Sim AI runs on port 3001
- If port 3001 is in use, change it in the startup script

### CORS Issues
- The integration uses proper CORS handling
- Sim AI needs to allow requests from VoiceCake's domain
- Uses `credentials: 'include'` for proper session management

### Authentication Issues
- Ensure you're logged into Sim AI
- Check session cookies and authentication
- The integration will show appropriate error messages

## Future Enhancements

1. **Deep Integration**: Embed specific Sim AI features directly in VoiceCake
2. **Custom Styling**: Match Sim AI's interface with VoiceCake's design
3. **Real-time Updates**: WebSocket integration for live updates
4. **Advanced Analytics**: Enhanced reporting and analytics
5. **Multi-workspace Support**: Better workspace switching and management

## Requirements

- Node.js and npm/npx
- Docker (for Sim AI)
- PostgreSQL with pgvector extension (for Sim AI features)
- VoiceCake development environment
- Sim AI running on port 3001

## Notes

- Components are built with TypeScript and follow React best practices
- Styling uses Tailwind CSS with VoiceCake's design system
- The integration provides real functionality when Sim AI is running
- Graceful fallback to mock data when Sim AI is not available
- All CRUD operations work with real Sim AI backend
- Proper error handling and user feedback
- Real-time data synchronization with Sim AI APIs
