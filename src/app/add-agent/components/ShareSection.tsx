import Button from "@/components/Button";
import Icon from "@/components/Icon";

interface ShareSectionProps {
  agentName: string;
  agentDescription: string;
  agentId: number | string | null;
  onShare: (platform: string) => void;
}

const shareOptions = [
  { name: "Assistant Link", icon: "link", platform: "link" },
  { name: "WhatsApp", icon: "whatsapp", platform: "whatsapp" },
  { name: "Email", icon: "mail", platform: "email" },
  { name: "Facebook", icon: "facebook", platform: "facebook" },
  { name: "Twitter", icon: "twitter", platform: "twitter" },
  { name: "Instagram", icon: "instagram", platform: "instagram" }
];

export const ShareSection = ({
  agentName,
  agentDescription,
  agentId,
  onShare
}: ShareSectionProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {shareOptions.map((option, index) => (
        <Button
          key={index}
          onClick={() => onShare(option.platform)}
          className="flex flex-col items-center gap-2 p-4 h-auto"
          isStroke
        >
          <Icon name={option.icon} className="w-6 h-6" />
          <span className="text-sm">{option.name}</span>
        </Button>
      ))}
    </div>
  );
};
