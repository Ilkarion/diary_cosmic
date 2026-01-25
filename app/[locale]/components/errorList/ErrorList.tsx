import "./errorList.scss"
export default function ErrorList({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;

  return (
    <div className="error-list">
      {errors.map((err, i) => (
        <div key={i} className="error-item">
          {err}
        </div>
      ))}
    </div>
  );
}
