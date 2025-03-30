export default function ToolCard({ title, description, icon }) {
    return (
      <div className="tool-card">
        <div>{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    );
  }
