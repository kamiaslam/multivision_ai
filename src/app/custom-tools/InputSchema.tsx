"use client";

import { useState } from "react";
import Field from "@/components/Field";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Checkbox from "@/components/Checkbox";

interface SchemaProperty {
    id?: string;
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    description: string;
    required: boolean;
    format?: string;
    enum?: string[];
}

interface InputSchemaProps {
    properties: SchemaProperty[];
    addProperty: () => void;
    updateProperty: (index: number, field: keyof SchemaProperty, value: any) => void;
    removeProperty: (index: number) => void;
}

const InputSchema = ({ properties, addProperty, updateProperty, removeProperty }: InputSchemaProps) => {
    const typeOptions = ["string", "number", "boolean", "array", "object"];

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-h6 text-t-primary">Input Properties</h3>
                <Button 
                    className="flex items-center gap-2"
                    onClick={addProperty}
                >
                    <Icon name="plus" className="w-4 h-4" />
                    Add Property
                </Button>
            </div>

            {/* Properties List */}
            <div className="space-y-3">
                {properties.map((property, index) => (
                    <div key={property.id || index} className="p-4 border border-s-subtle rounded-3xl bg-b-surface2">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-button text-t-primary">Property {index + 1}</h4>
                            <Button 
                                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                                isStroke
                                onClick={() => removeProperty(index)}
                            >
                                <Icon name="trash" className="w-4 h-4" />
                                Remove Property
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Property Name */}
                            <Field
                                label="Property Name*"
                                placeholder="property_name"
                                value={property.name}
                                onChange={(e) => updateProperty(index, 'name', e.target.value)}
                            />

                            {/* Type */}
                            <div>
                                <label className="block text-button mb-4">Type*</label>
                                <select
                                    className="w-full h-12 px-4.5 border border-s-subtle rounded-full text-body-2 text-t-primary outline-none transition-colors hover:border-s-highlight focus:border-s-highlight bg-b-surface2"
                                    value={property.type}
                                    onChange={(e) => updateProperty(index, 'type', e.target.value as any)}
                                >
                                    {typeOptions.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                            <Field
                                label="Description*"
                                placeholder="Property description"
                                value={property.description}
                                onChange={(e) => updateProperty(index, 'description', e.target.value)}
                            />
                        </div>

                        {/* Required Checkbox */}
                        <div className="mt-4">
                            <Checkbox
                                label="Required"
                                checked={property.required}
                                onChange={(checked) => updateProperty(index, 'required', checked)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {properties.length === 0 && (
                <div className="text-center py-8 text-t-secondary">
                    No properties added yet. Click "Add Property" to get started.
                </div>
            )}
        </div>
    );
};

export default InputSchema;
