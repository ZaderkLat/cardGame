
// Define the type for the dialog data that will be passed to the component
export type dialogData = {
    open: boolean;
    title: string;
    description: string;
    status: statusDialog;
};

export type statusDialog = "win" | "lose" | "continue";