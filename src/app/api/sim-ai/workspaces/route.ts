import { NextResponse } from 'next/server';

export async function GET() {
    // Mock workspace data
    const workspaces = [
        {
            id: 'ws-1',
            name: 'My Workspace',
            description: 'Default workspace for AI agents and workflows',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            agentCount: 12,
            workflowCount: 8,
            executionCount: 156,
            successRate: 98
        }
    ];

    return NextResponse.json({ workspaces });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        // Mock workspace creation
        const newWorkspace = {
            id: `ws-${Date.now()}`,
            name: name || 'New Workspace',
            description: 'New AI workspace',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            agentCount: 0,
            workflowCount: 0,
            executionCount: 0,
            successRate: 100
        };

        return NextResponse.json({ workspace: newWorkspace }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create workspace' },
            { status: 500 }
        );
    }
}

