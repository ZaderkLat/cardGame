//it's function is show when the user win or lose in a round

interface FloatingMessageProps {
    isVisible: boolean;
    children: React.ReactNode;
}
export default function FloatComponent({ isVisible, children }: FloatingMessageProps) {
    if (!isVisible) return null;
    return (
        <div
            className="absolute z-50 w-70 bg-white dark:bg-zinc-800 border rounded-lg shadow-lg p-4"
        >
            {children}
        </div>
    );


}