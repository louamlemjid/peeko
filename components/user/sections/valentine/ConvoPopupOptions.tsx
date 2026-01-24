import { Button } from "@/components/ui/button";

interface PopupProps {
  show: boolean;
  convoCode:string;
  onClose: () => void;
}

const PopupOptions: React.FC<PopupProps> = ({ show,convoCode, onClose }) => {
  if (!show) return null;
  console.log(convoCode)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
      <div className="flex flex-col gap-4 w-full max-w-md bg-white rounded-t-2xl p-4 shadow-xl">
        <Button variant="destructive" className="w-full">
          Delete Conversation
        </Button>
        <Button variant="outline" className="w-full mb-4" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default PopupOptions;
