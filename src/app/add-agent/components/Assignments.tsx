import Card from "@/components/Card";
import Field from "@/components/Field";
import Badge from "@/components/Badge";
import Icon from "@/components/Icon";
import { formatPhoneNumber, isValidUSUKPhoneNumber } from "@/utils/phoneNumber";

interface AssignmentsProps {
  phoneNumber: string;
  onPhoneNumberChange: (phoneNumber: string) => void;
  onPhoneNumberBlur: (phoneNumber: string) => void;
}

const automations = [
  "Inbound → Empth → CRM",
  "Voice → Email",
  "Miscalled → Whatsapp"
];

export const Assignments = ({
  phoneNumber,
  onPhoneNumberChange,
  onPhoneNumberBlur
}: AssignmentsProps) => {
  return (
    <div className="space-y-3">
      <Card title="Assign Phone Numbers" className="p-6">
        <div className="space-y-4">
          <Field
            label="Inbound Phone Number"
            type="tel"
            placeholder="Enter US or UK phone number (e.g., +441344959609 for UK, +12025551234 for US)"
            value={phoneNumber}
            validated={!!(phoneNumber && isValidUSUKPhoneNumber(phoneNumber))}
            onChange={(e) => {
              let value = e.target.value;
              
              // Only allow digits and + (remove spaces, parentheses, and hyphens)
              value = value.replace(/[^\d\+]/g, '');
              
              // Auto-add + if user starts typing without it
              if (value && !value.startsWith('+') && !value.startsWith('1') && !value.startsWith('44')) {
                // If it looks like a US number (10 digits), add +1
                if (/^\d{10}$/.test(value.replace(/\D/g, ''))) {
                  value = '+1' + value;
                }
                // If it looks like a UK number (11 digits starting with 44), add +
                else if (/^44\d{9,10}$/.test(value.replace(/\D/g, ''))) {
                  value = '+' + value;
                }
              }
              
              // Prevent non-US/UK country codes
              const cleaned = value.replace(/\D/g, '');
              if (cleaned && !cleaned.startsWith('1') && !cleaned.startsWith('44') && cleaned.length > 2) {
                // If user tries to enter a non-US/UK country code, don't update
                return;
              }
              
              onPhoneNumberChange(value);
            }}
            onBlur={(e) => {
              if (e.target.value && isValidUSUKPhoneNumber(e.target.value)) {
                onPhoneNumberBlur(formatPhoneNumber(e.target.value));
              }
            }}
            tooltip="Enter a valid US or UK phone number with country code (no spaces needed). Only US (+1) and UK (+44) numbers are supported."
          />
          
          {/* Validation and Help Text */}
          <div className="space-y-1">
            {phoneNumber && !isValidUSUKPhoneNumber(phoneNumber) && (
              <p className="text-xs text-red-500">Please enter a valid US or UK phone number</p>
            )}
            {phoneNumber && isValidUSUKPhoneNumber(phoneNumber) && (
              <p className="text-xs text-green-600">✓ Valid US or UK phone number format</p>
            )}
            <p className="text-xs text-t-secondary">
              Supported formats: US (+12025551234), UK (+441344959609). Only US and UK numbers are supported. No spaces needed.
            </p>
          </div>
          
          {phoneNumber && isValidUSUKPhoneNumber(phoneNumber) && (
            <div className="flex items-center justify-between p-3 bg-b-surface2 rounded-2xl">
              <div className="flex items-center gap-3">
                <Icon name="phone" className="w-4 h-4 text-primary-01" />
                <span className="text-t-primary font-medium">
                  {formatPhoneNumber(phoneNumber)}
                </span>
              </div>
              <Badge className="bg-primary-02/20 text-primary-02 border border-primary-02/30">
                Assigned
              </Badge>
            </div>
          )}
        </div>
      </Card>

      <Card title="Assign Automations" className="p-6">
        <div className="space-y-3">
          {automations.map((automation, index) => (
            <div key={index} className="p-3 bg-b-surface2 rounded-2xl">
              <span className="text-t-primary">{automation}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
