import React, { useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import { Agent } from "@/types/agent";
import { toast } from "sonner";
import Field from "../Field";

interface ShareAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
}

export function ShareAgentModal({ isOpen, onClose, agent }: ShareAgentModalProps) {
  const [copied, setCopied] = useState(false);
  const [widgetCodeCopied, setWidgetCodeCopied] = useState(false);

  if (!agent) return null;

  const shareUrl = `${window.location.origin}/share/${agent.id}`;
  const shareText = `Try out ${agent.name} - an AI voice agent: ${agent.description}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    
    let shareLink = "";
    
    switch (platform) {
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "email":
        shareLink = `mailto:?subject=Check out this AI agent: ${agent.name}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, "_blank", "width=600,height=400");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Chat with ${agent.name}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const widgetCode = `
  <script src="${window.location.origin}/voicecake-widget.js" 
      data-agent-id="${agent.id}" 
      data-position="bottom-right" 
      data-theme="dark">
  </script>
  `;

  const handleCopyWidgetCode = async () => {
    try {
      await navigator.clipboard.writeText(widgetCode);
      setWidgetCodeCopied(true);
      toast.success("Widget code copied to clipboard!");
      setTimeout(() => setWidgetCodeCopied(false), 2000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = widgetCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setWidgetCodeCopied(true);
      toast.success("Widget code copied to clipboard!");
      setTimeout(() => setWidgetCodeCopied(false), 2000);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} isSlidePanel>
      {/* Header */}
      <div className="flex items-center justify-between h-20 pl-10 pr-20 pt-5 pb-3 text-h5 max-md:h-18 max-md:pt-3 max-md:pl-9">
        <div className="min-w-0 flex-1">
          <h2 className="text-h5 font-semibold">Share Agent</h2>
          {agent && (
            <p className="text-sm text-t-secondary truncate">{agent.name}</p>
          )}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="h-[calc(100svh-5rem)] px-4 pb-4 overflow-y-auto max-md:h-[calc(100svh-4.5rem)] max-md:px-3">
        <div className="space-y-3">
          {/* Agent Info */}
          <Card className="p-3" title="Agent Information">
            <div className="flex items-center gap-3">
              <div className="min-w-[40px] min-h-[40px] bg-gradient-to-br from-primary-02 to-primary-01 rounded-lg flex items-center justify-center text-white font-semibold">
                {(() => {
                  const name = agent.name || '';
                  const words = name.trim().split(/\s+/);
                  
                  if (words.length >= 2) {
                    // If there are 2 or more words, take first letter of first two words
                    return (words[0][0] + words[1][0]).toUpperCase();
                  } else if (words.length === 1 && words[0].length >= 2) {
                    // If there's only one word with 2+ characters, take first two letters
                    return words[0].slice(0, 2).toUpperCase();
                  } else if (words.length === 1 && words[0].length === 1) {
                    // If there's only one character, duplicate it
                    return (words[0] + words[0]).toUpperCase();
                  } else {
                    // Fallback
                    return 'AG';
                  }
                })()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg text-t-primary truncate">{agent.name}</h3>
                <p className="text-sm text-t-secondary line-clamp-2">
                  {agent.description}
                </p>
              </div>
            </div>
          </Card>

          {/* Share Link */}
          <Card className="p-3" title="Share Link">
            <div className="flex gap-2">
              <Field 
                value={shareUrl} 
                readOnly 
                className="w-100"
              />
              <Button 
                onClick={handleCopyLink}
                isBlack
                isCircle
                className={`w-10 h-10 ${copied ? "bg-green-50 border-green-200" : ""}`}
              >
                <Icon name={copied ? "copied" : "copy"} className={`w-4 h-4 ${copied ? "text-green-600" : ""}`} />
              </Button>
            </div>
          </Card>

          {/* Social Media Buttons */}
          <Card className="p-3" title="Share on">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleShare("whatsapp")}
                isStroke
                className="flex items-center gap-2 hover:bg-b-highlight"
              >
                <Icon name="whatsapp" className="w-4 h-4 fill-primary-02" />
                WhatsApp
              </Button>
              
              <Button 
                onClick={() => handleShare("twitter")}
                isStroke
                className="flex items-center gap-2 hover:bg-b-highlight"
              >
                <Icon name="twitter" className="w-4 h-4 fill-primary-02" />
                Twitter
              </Button>
              
              <Button 
                onClick={() => handleShare("facebook")}
                isStroke
                className="flex items-center gap-2 hover:bg-b-highlight"
              >
                <Icon name="facebook" className="w-4 h-4 fill-primary-02" />
                Facebook
              </Button>
              
              <Button 
                onClick={() => handleShare("linkedin")}
                isStroke
                className="flex items-center gap-2 hover:bg-b-highlight"
              >
                <Icon name="linkedIn" className="w-4 h-4 fill-primary-02" />
                LinkedIn
              </Button>
              
              <Button 
                onClick={() => handleShare("email")}
                isStroke
                className="flex items-center gap-2 hover:bg-b-highlight"
              >
                <Icon name="mail" className="w-4 h-4 fill-t-secondary" />
                Email
              </Button>
              
              <Button 
                onClick={handleNativeShare}
                isStroke
                className="flex items-center gap-2 hover:bg-b-highlight"
              >
                <Icon name="share" className="w-4 h-4 fill-t-secondary" />
                More Options
              </Button>
            </div>
          </Card>

          {/* Widget Code */}
          <Card className="p-3" title="Widget Code">
            <div className="space-y-3">
              <p className="text-sm text-t-secondary">
                Embed this agent as a widget on your website:
              </p>
              <div className="bg-b-secondary rounded-lg p-3 font-mono text-xs overflow-x-auto border border-b-border">
                <code className="text-t-primary whitespace-pre-wrap block">{widgetCode}</code>
              </div>
              <Button 
                onClick={handleCopyWidgetCode}
                isBlack
                className={`w-full justify-center ${widgetCodeCopied ? "bg-green-50 border-green-200" : ""}`}
              >
                <Icon name={widgetCodeCopied ? "copied" : "copy"} className={`w-4 h-4 mr-2 ${widgetCodeCopied ? "text-green-600" : ""}`} />
                {widgetCodeCopied ? "Copied!" : "Copy Widget Code"}
              </Button>
            </div>
          </Card>

          {/* Preview Link */}
          <Card className="p-3" title="Preview Public URL">
            <Button 
              onClick={() => window.open(shareUrl, "_blank")}
              isBlack
              className="w-full justify-center"
            >
              <Icon name="link" className="w-4 h-4 mr-2" />
              Open shared agent page
            </Button>
          </Card>
        </div>
      </div>
    </Modal>
  );
}
