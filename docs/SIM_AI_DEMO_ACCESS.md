# 🚀 Sim AI Demo Access Guide

## 🎯 **Quick Access Methods**

### **Method 1: Create a Demo Account (Recommended)**

1. **Visit Sim AI**: http://localhost:3001
2. **Click "Sign Up"** or "Get Started"
3. **Use these demo credentials**:
   ```
   Email: demo@sim.ai
   Password: demo123456
   ```
4. **Or create a new account** with any email

### **Method 2: Use API Access (Advanced)**

Since Sim AI is running locally, you can access the APIs directly:

#### **Workspaces API**
```bash
curl http://localhost:3001/api/workspaces
```

#### **Agents API**
```bash
curl http://localhost:3001/api/agents
```

#### **Workflows API**
```bash
curl http://localhost:3001/api/workflows
```

#### **Knowledge Base API**
```bash
curl http://localhost:3001/api/knowledge
```

### **Method 3: Access Through VoiceCake Integration**

1. **Start VoiceCake**: `npm run dev` (in voicecake-nextjs directory)
2. **Visit**: http://localhost:3000/sim-ai
3. **Click "Launch Sim AI"** button
4. **This will open Sim AI in a new tab**

## 🔧 **Demo Account Setup**

### **Step 1: Create Account**
1. Go to http://localhost:3001
2. Click "Sign Up"
3. Enter any email and password
4. Verify email (if required)

### **Step 2: Explore Features**
Once logged in, you'll have access to:

- **🏗️ Workspace Management**
  - Create new workspaces
  - Manage existing workspaces
  - View workspace analytics

- **🤖 AI Agents**
  - Create chat agents
  - Build workflow agents
  - Configure email agents
  - Set up webhook agents

- **⚡ Workflows**
  - Visual workflow builder
  - Drag-and-drop interface
  - Workflow templates
  - Execution monitoring

- **📚 Knowledge Base**
  - Document upload
  - Web scraping
  - Database connections
  - API integrations

## 🎨 **What You'll See**

### **Main Dashboard**
- Workspace overview
- Recent activity
- Quick actions
- Performance metrics

### **Agent Builder**
- Visual canvas interface
- Node-based workflow design
- Real-time preview
- Testing capabilities

### **Workflow Editor**
- Drag-and-drop interface
- Conditional logic
- API integrations
- Error handling

### **Knowledge Management**
- Document processing
- Vector embeddings
- Search capabilities
- Content organization

## 🔗 **Integration with VoiceCake**

The VoiceCake integration provides:

1. **Unified Navigation**: Access Sim AI from VoiceCake menu
2. **Seamless Experience**: Consistent UI/UX
3. **Real-time Data**: Live workspace and agent data
4. **Quick Actions**: Create agents and workflows directly

## 🚨 **Troubleshooting**

### **If Sim AI Won't Start**
```bash
# Check if containers are running
docker ps

# Restart Sim AI
cd voicecake-nextjs
./start-sim-ai.sh
```

### **If APIs Don't Respond**
```bash
# Check Sim AI status
curl http://localhost:3001

# Should return HTML content, not empty
```

### **If You Can't Access Sim AI**
1. Make sure Docker Desktop is running
2. Ensure port 3001 is not blocked
3. Check firewall settings
4. Try accessing http://localhost:3001 directly

## 🎉 **Success Indicators**

You'll know everything is working when:

✅ **Sim AI loads at http://localhost:3001**  
✅ **You can create an account and log in**  
✅ **VoiceCake integration shows real data**  
✅ **APIs respond with workspace/agent data**  
✅ **You can create and manage agents/workflows**  

## 📞 **Need Help?**

If you encounter issues:

1. **Check Docker**: `docker ps` should show running containers
2. **Check Logs**: Look for error messages in the terminal
3. **Restart Services**: Stop and restart Sim AI if needed
4. **Clear Browser Cache**: Sometimes helps with login issues

---

**🎯 Goal**: Get full access to Sim AI's visual agent builder, workflow editor, and knowledge management system to see the complete AI automation platform in action!

