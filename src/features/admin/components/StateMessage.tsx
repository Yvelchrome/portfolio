"use client";

interface StateMessageProps {
  message: string;
}

export const StateMessage = ({ message }: StateMessageProps) => {
  return (
    <div className="text-muted-foreground py-12 text-center">
      <span>{message}</span>
    </div>
  );
};
