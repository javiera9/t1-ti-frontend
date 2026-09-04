import { useState } from "react";

// Traduce un property de JSON Schema al <input> correspondiente. No cubre
// todo el estandar (JSON Schema es enorme) -- cubre lo que necesitan las
// tools reales de los 3 MCPs: string (con o sin enum/format date), integer,
// number, boolean.
function Field({ name, schema, required, value, onChange }) {
  const isRequired = required.includes(name);
  const label = schema.description || name;

  if (schema.enum) {
    return (
      <label className="field">
        <span>
          {label} {isRequired && <em>*</em>}
        </span>
        <select
          value={value ?? ""}
          required={isRequired}
          onChange={(e) => onChange(name, e.target.value)}
        >
          <option value="" disabled>
            seleccionar...
          </option>
          {schema.enum.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (schema.type === "integer" || schema.type === "number") {
    return (
      <label className="field">
        <span>
          {label} {isRequired && <em>*</em>}
        </span>
        <input
          type="number"
          value={value ?? ""}
          min={schema.minimum}
          max={schema.maximum}
          required={isRequired}
          onChange={(e) =>
            onChange(name, e.target.value === "" ? "" : Number(e.target.value))
          }
        />
      </label>
    );
  }

  if (schema.type === "boolean") {
    return (
      <label className="field field-checkbox">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(name, e.target.checked)}
        />
        <span>
          {label} {isRequired && <em>*</em>}
        </span>
      </label>
    );
  }

  const inputType = schema.format === "date" ? "date" : "text";
  return (
    <label className="field">
      <span>
        {label} {isRequired && <em>*</em>}
      </span>
      <input
        type={inputType}
        value={value ?? ""}
        required={isRequired}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </label>
  );
}

function DynamicForm({ inputSchema, onSubmit, submitting }) {
  const properties = inputSchema?.properties ?? {};
  const required = inputSchema?.required ?? [];
  const fieldNames = Object.keys(properties);
  const [values, setValues] = useState({});

  const handleChange = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form className="dynamic-form" onSubmit={handleSubmit}>
      {fieldNames.length === 0 ? (
        <p className="status">Esta tool no necesita argumentos.</p>
      ) : (
        fieldNames.map((name) => (
          <Field
            key={name}
            name={name}
            schema={properties[name]}
            required={required}
            value={values[name]}
            onChange={handleChange}
          />
        ))
      )}
      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? "Ejecutando..." : "Ejecutar"}
      </button>
    </form>
  );
}

export default DynamicForm;
