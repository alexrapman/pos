// src/components/accessibility/AccessibleInput.tsx
interface AccessibleInputProps {
    id: string;
    name: string;
    label: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

export const AccessibleInput: React.FC<AccessibleInputProps> = ({
    id,
    name,
    label,
    type = 'text',
    value,
    onChange,
    error
}) => {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {error && (
                <p id={`${id}-error`} className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};