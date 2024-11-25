// src/components/accessibility/InputGroup.tsx
interface InputGroupProps {
    id: string;
    label: string;
    error?: string;
    description?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
    id,
    label,
    error,
    description,
    children
}) => {
    return (
        <div role="group">
            <label
                htmlFor={id}
                className="block text-sm font-medium"
            >
                {label}
            </label>
            {description && (
                <span id={`${id}-description`} className="text-sm text-gray-500">
                    {description}
                </span>
            )}
            {children}
            {error && (
                <span
                    id={`${id}-error`}
                    className="text-sm text-red-600"
                    role="alert"
                >
                    {error}
                </span>
            )}
        </div>
    );
};