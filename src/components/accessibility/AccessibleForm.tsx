// src/components/accessibility/AccessibleForm.tsx
import React, { useState } from 'react';

interface AccessibleFormProps {
    onSubmit: (data: Record<string, any>) => void;
    children: React.ReactNode;
}

export const AccessibleForm: React.FC<AccessibleFormProps> = ({ onSubmit, children }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            onSubmit(formData);
        }
    };

    const validateForm = (data: Record<string, any>) => {
        const errors: Record<string, string> = {};
        // Implementar validaciones específicas
        if (!data.name) {
            errors.name = 'El nombre es obligatorio';
        }
        if (!data.email) {
            errors.email = 'El correo electrónico es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'El correo electrónico no es válido';
        }
        return errors;
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        onChange: handleChange,
                        value: formData[child.props.name] || '',
                        error: errors[child.props.name]
                    });
                }
                return child;
            })}
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Enviar
            </button>
        </form>
    );
};