import { Button } from "@/components/ui/button";

interface PopupProps {
  show: boolean;
  messageId:string;
  onClose: () => void;
}

const MessagePopupOptions: React.FC<PopupProps> = ({ show,messageId, onClose }) => {
  if (!show) return null;
  console.log(messageId)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
      <div className="flex flex-col gap-4 w-full max-w-md bg-white rounded-t-2xl p-4 shadow-xl">
        
        <Button variant="destructive" className="w-full">
          Delete Message
        </Button>
        <Button variant="outline" className="w-full mb-4" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default MessagePopupOptions;
