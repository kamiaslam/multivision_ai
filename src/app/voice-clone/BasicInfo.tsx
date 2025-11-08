import Field from "@/components/Field";
import Select from "@/components/Select";
import { FormData } from "./types";

interface BasicInfoProps {
  formData: FormData;
  setFormData: (updater: React.SetStateAction<FormData>) => void;
}

const languageOptions = [
  { id: 0, name: "English", code: "en" },
  { id: 1, name: "Spanish", code: "es" },
  { id: 2, name: "French", code: "fr" },
  { id: 3, name: "German", code: "de" },
  { id: 4, name: "Italian", code: "it" },
  { id: 5, name: "Portuguese", code: "pt" },
  { id: 6, name: "Chinese", code: "zh" },
  { id: 7, name: "Japanese", code: "ja" },
  { id: 8, name: "Korean", code: "ko" },
  { id: 9, name: "Arabic", code: "ar" },
  { id: 10, name: "Hindi", code: "hi" },
  { id: 11, name: "Russian", code: "ru" }
];

const BasicInfo = ({ formData, setFormData }: BasicInfoProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-t-primary mb-4">Basic Information</h3>
        <p className="text-sm text-t-secondary mb-6">
          Provide basic details about your voice clone including name, description, and language.
        </p>
      </div>

      <div className="space-y-4">
        <Field
          label="Voice Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter voice name"
          required
        />

        <Field
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter voice description"
          textarea
          rows={3}
        />

        <div>
          <Select
            label="Language"
            value={languageOptions.find(opt => opt.code === formData.language) || languageOptions[0]}
            onChange={(option) => setFormData(prev => ({ ...prev, language: option.code || "en" }))}
            options={languageOptions}
            placeholder="Select language"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
