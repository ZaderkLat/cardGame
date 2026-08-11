//it's function is show when the user win or lose in a round

interface FloatingMessageProps {
    isVisible: boolean;
    children: React.ReactNode;
    position: string
}
export default function FloatComponent({ isVisible, children, position }: FloatingMessageProps) {
    if (!isVisible) return null;
    return (
        <div
            className={`${position} absolute  bg-white dark:bg-zinc-800 border rounded-lg shadow-lg p-4`}
        >
            {children}
        </div>
    );


}