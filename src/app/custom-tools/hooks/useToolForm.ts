import { useState, useCallback } from 'react';
import { Tool, FormData, SchemaProperty } from '../types';

export const useToolForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    input_schema: {
      type: 'object',
      properties: {},
      required: []
    },
    output_schema: {
      type: 'object',
      properties: {},
      required: []
    },
    webhook_url: '',
    webhook_secret: '',
    timeout: null,
    max_retries: 3,
    is_active: true,
    is_public: false
  });

  const [inputProperties, setInputProperties] = useState<SchemaProperty[]>([]);

  const resetForm = useCallback(() => {
    // Prevent state updates during server-side rendering
    if (typeof window === 'undefined') {
      return;
    }

    setFormData({
      name: '',
      description: '',
      input_schema: {
        type: 'object',
        properties: {},
        required: []
      },
      output_schema: {
        type: 'object',
        properties: {},
        required: []
      },
      webhook_url: '',
      webhook_secret: '',
      timeout: null,
      max_retries: 3,
      is_active: true,
      is_public: false
    });
    setInputProperties([]);
  }, []);

  const addInputProperty = useCallback(() => {
    // Prevent state updates during server-side rendering
    if (typeof window === 'undefined') {
      return;
    }

    const newProperty: SchemaProperty = {
      id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      type: 'string',
      description: '',
      required: false
    };
    setInputProperties(prevProperties => [...prevProperties, newProperty]);
  }, []);

  const updateInputProperty = useCallback((
    index: number,
    field: keyof SchemaProperty,
    value: any
  ) => {
    // Prevent state updates during server-side rendering
    if (typeof window === 'undefined') {
      return;
    }

    setInputProperties(prevProperties => {
      const updatedProperties = [...prevProperties];
      
      if (field === 'enum') {
        (updatedProperties[index] as any)[field] = value ? value.split(',').map((v: string) => v.trim()) : undefined;
      } else {
        (updatedProperties[index] as any)[field] = value;
      }

      return updatedProperties;
    });
  }, []);

  const removeInputProperty = useCallback((index: number) => {
    // Prevent state updates during server-side rendering
    if (typeof window === 'undefined') {
      return;
    }

    setInputProperties(prevProperties => prevProperties.filter((_, i) => i !== index));
  }, []);

  const buildSchema = useCallback((properties: SchemaProperty[]) => {
    const schemaProperties: Record<string, any> = {};
    const required: string[] = [];

    properties.forEach(prop => {
      if (!prop.name) return;

      const schemaProp: any = {
        type: prop.type,
        description: prop.description
      };

      if (prop.format) {
        schemaProp.format = prop.format;
      }

      if (prop.enum && prop.enum.length > 0) {
        schemaProp.enum = prop.enum;
      }

      schemaProperties[prop.name] = schemaProp;

      if (prop.required) {
        required.push(prop.name);
      }
    });

    return {
      type: 'object' as const,
      properties: schemaProperties,
      required
    };
  }, []);

  const validateForm = useCallback((): string | null => {
    if (!formData.name.trim()) return 'Tool name is required';
    if (!/^[a-zA-Z0-9_]+$/.test(formData.name)) return 'Tool name must contain only alphanumeric characters and underscores';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.webhook_url.trim()) return 'Webhook URL is required';
    if (!/^https?:\/\/.+/.test(formData.webhook_url)) return 'Webhook URL must start with http:// or https://';
    
    if (formData.timeout === null || formData.timeout === undefined) {
      return 'Timeout is required';
    }
    if (typeof formData.timeout === 'number' && (formData.timeout < 10 || formData.timeout > 300)) {
      return 'Timeout must be between 10 and 300 seconds';
    }
    
    if (formData.max_retries < 1 || formData.max_retries > 10) return 'Max retries must be between 1 and 10';

    const validInputs = inputProperties.filter(p => p.name.trim());
    if (validInputs.length === 0) return 'At least one input property is required';

    return null;
  }, [formData, inputProperties]);

  const populateForm = useCallback((tool: Tool) => {
    // Prevent state updates during server-side rendering
    if (typeof window === 'undefined') {
      return;
    }

    setFormData({
      name: tool.name || '',
      description: tool.description || '',
      input_schema: tool.input_schema || {
        type: 'object',
        properties: {},
        required: []
      },
      output_schema: tool.output_schema || {
        type: 'object',
        properties: {},
        required: []
      },
      webhook_url: tool.webhook_url || '',
      webhook_secret: tool.webhook_secret || '',
      timeout: tool.timeout || 30,
      max_retries: tool.max_retries || 3,
      is_active: tool.is_active || false,
      is_public: tool.is_public || false
    });

    // Populate input properties
    if (tool.input_schema && tool.input_schema.properties) {
      setInputProperties(Object.entries(tool.input_schema.properties).map(([key, prop]) => ({
        name: key,
        type: prop.type || 'string',
        description: prop.description || '',
        required: tool.input_schema?.required?.includes(key) || false
      })));
    } else {
      setInputProperties([]);
    }
  }, []);

  return {
    formData,
    setFormData,
    inputProperties,
    setInputProperties,
    resetForm,
    addInputProperty,
    updateInputProperty,
    removeInputProperty,
    buildSchema,
    validateForm,
    populateForm
  };
};
