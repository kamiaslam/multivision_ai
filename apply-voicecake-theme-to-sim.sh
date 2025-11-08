#!/bin/bash

# VoiceCake Theme Application Script for Sim AI
# This script applies VoiceCake theme directly to the running Sim AI container

echo "🎨 Applying VoiceCake theme to Sim AI..."

# Check if Sim AI container is running
if ! docker ps | grep -q simstudio-app; then
    echo "❌ Sim AI container is not running. Please start Sim AI first."
    exit 1
fi

echo "✅ Sim AI container found"

# Copy VoiceCake CSS file to container
echo "📁 Copying VoiceCake CSS to Sim AI..."
docker cp voicecake-nextjs/voicecake-override.css simstudio-app:/app/apps/sim/app/voicecake-override.css

# Update branding configuration
echo "🎨 Updating branding configuration..."
docker exec simstudio-app sed -i 's/name: '\''Sim'\''/name: '\''VoiceCake AI'\''/g' /app/apps/sim/lib/branding/branding.ts
docker exec simstudio-app sed -i 's/primaryColor: '\''#701ffc'\''/primaryColor: '\''#2a85ff'\''/g' /app/apps/sim/lib/branding/branding.ts
docker exec simstudio-app sed -i 's/primaryHoverColor: '\''#802fff'\''/primaryHoverColor: '\''#1a75ef'\''/g' /app/apps/sim/lib/branding/branding.ts
docker exec simstudio-app sed -i 's/secondaryColor: '\''#6518e6'\''/secondaryColor: '\''#00a656'\''/g' /app/apps/sim/lib/branding/branding.ts
docker exec simstudio-app sed -i 's/accentColor: '\''#9d54ff'\''/accentColor: '\''#7f5fff'\''/g' /app/apps/sim/lib/branding/branding.ts
docker exec simstudio-app sed -i 's/accentHoverColor: '\''#a66fff'\''/accentHoverColor: '\''#6f4fef'\''/g' /app/apps/sim/lib/branding/branding.ts
docker exec simstudio-app sed -i 's/backgroundColor: '\''#0c0c0c'\''/backgroundColor: '\''#fdfdfd'\''/g' /app/apps/sim/lib/branding/branding.ts

# Ensure CSS import is in layout
echo "📝 Updating layout to include VoiceCake CSS..."
docker exec simstudio-app sed -i '/import.*globals.css/a import "./voicecake-override.css"' /app/apps/sim/app/layout.tsx

# Restart container to apply changes
echo "🔄 Restarting Sim AI to apply VoiceCake theme..."
docker restart simstudio-app

# Wait for container to be ready
echo "⏳ Waiting for Sim AI to restart..."
sleep 15

# Check if container is running
if docker ps | grep -q simstudio-app; then
    echo "✅ VoiceCake theme applied successfully!"
    echo "🌐 Sim AI is now running with VoiceCake theme at: http://localhost:3001"
    echo ""
    echo "🎨 Changes applied:"
    echo "   • VoiceCake Blue (#2a85ff) primary buttons"
    echo "   • VoiceCake Green (#00a656) success states"
    echo "   • VoiceCake Purple (#7f5fff) accents"
    echo "   • Inter font family"
    echo "   • VoiceCake rounded corners (0.75rem)"
    echo "   • VoiceCake card shadows"
    echo "   • Brand name changed to 'VoiceCake AI'"
else
    echo "❌ Failed to restart Sim AI container"
    exit 1
fi

