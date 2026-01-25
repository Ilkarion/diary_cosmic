import "./successMsgs.scss"
export default function SuccessMsgs({ msg }: { msg: string }) {
  return (
    <div className="success-list">
        <div className="success-item">
          {msg}
        </div>
    </div>
  );
}
