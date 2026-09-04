import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "./api";
import DynamicForm from "./DynamicForm";

// El content de tools/call viene como [{type: "text", text: "..."}], y ese
// texto suele ser JSON en si mismo (confirmado probando contra Andes Air).
// Si se puede parsear, lo mostramos indentado -- si no, tal cual viene.
function formatResult(result) {
  if (result?.content) {
    return result.content
      .map((block) => {
        if (block.type === "text") {
          try {
            return JSON.stringify(JSON.parse(block.text), null, 2);
          } catch {
            return block.text;
          }
        }
        return JSON.stringify(block, null, 2);
      })
      .join("\n\n");
  }
  return JSON.stringify(result, null, 2);
}

function ResultEntry({ entry }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="result-entry">
      <div className="result-entry-header">
        <span className="result-entry-title">
          {entry.status === "loading" ? "⏳" : entry.status === "error" ? "⚠️" : "✅"}{" "}
          {entry.toolName}
          <span className="status">{entry.time}</span>
        </span>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? "Mostrar" : "Ocultar"}
        </button>
      </div>
      {!collapsed && (
        <div className="result-entry-body">
          {entry.status === "loading" && <p className="status">Ejecutando...</p>}
          {entry.status === "error" && <p className="status">Error: {entry.error}</p>}
          {entry.status === "ok" && <pre className="result">{formatResult(entry.data)}</pre>}
        </div>
      )}
    </div>
  );
}

function ToolCard({ tool, open, onToggle, onRun, submitting, results }) {
  return (
    <div className="tool-card">
      <div className="tool-card-header">
        <div className="tool-card-title">
          <strong>{tool.name}</strong>
          <button className="btn btn-secondary" type="button" onClick={onToggle}>
            {open ? "Ocultar formulario" : "Usar esta tool"}
          </button>
        </div>
        <p className="status">{tool.description}</p>
        <p className="schema-label">inputSchema</p>
        <pre className="result">{JSON.stringify(tool.inputSchema, null, 2)}</pre>
      </div>

      {open && (
        <div className="tool-form">
          <DynamicForm
            inputSchema={tool.inputSchema}
            onSubmit={(args) => onRun(tool, args)}
            submitting={submitting}
          />

          {results.length > 0 && (
            <div className="results-log">
              {results.map((entry) => (
                <ResultEntry key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Tools() {
  const { name } = useParams();
  const [tools, setTools] = useState(null);
  const [error, setError] = useState(null);
  const [openTools, setOpenTools] = useState(() => new Set());
  const [results, setResults] = useState([]);

  useEffect(() => {
    apiFetch(`/mcp/${name}/tools`)
      .then(setTools)
      .catch((err) => setError(err.message));
  }, [name]);

  const toggleTool = (toolName) => {
    setOpenTools((prev) => {
      const next = new Set(prev);
      if (next.has(toolName)) {
        next.delete(toolName);
      } else {
        next.add(toolName);
      }
      return next;
    });
  };

  const runTool = async (tool, args) => {
    const id = crypto.randomUUID();
    const time = new Date().toLocaleTimeString();
    setResults((prev) => [{ id, toolName: tool.name, time, status: "loading" }, ...prev]);

    try {
      const data = await apiFetch(`/mcp/${name}/tools/${tool.name}/call`, {
        method: "POST",
        body: JSON.stringify(args),
      });
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "ok", data } : r))
      );
    } catch (err) {
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "error", error: err.message } : r))
      );
    }
  };

  const isSubmitting = (toolName) =>
    results.some((r) => r.toolName === toolName && r.status === "loading");

  return (
    <div className="hero hero-wide">
      <h1>Tools de {name}</h1>
      <p>
        <Link to="/dashboard">&larr; Volver</Link>
      </p>

      {error && <p className="status">Error: {error}</p>}
      {!tools && !error && <p className="status">Cargando...</p>}

      <div className="mcp-list">
        {tools?.map((tool) => (
          <ToolCard
            key={tool.name}
            tool={tool}
            open={openTools.has(tool.name)}
            onToggle={() => toggleTool(tool.name)}
            onRun={runTool}
            submitting={isSubmitting(tool.name)}
            results={results.filter((r) => r.toolName === tool.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default Tools;
