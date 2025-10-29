import { useEffect, useState } from "react";

function MultiSelect({ options, selected, onChange }) {
  const handleSelect = (e) => {
    const value = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    onChange(value);
  };
  return (
    <select multiple className="w-full border rounded p-2" value={selected} onChange={handleSelect}>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

const SHEET_URL = "https://api.sheetbest.com/sheets/bfeac5dd-0647-4ec3-84a3-7ba9d1ae40cc";

const countryOptions = ["HK", "SG", "JP", "CN"];
const categoryOptions = [
  "Home Care/Eco/Tooth Polish/Hand Soap",
  "Personal Care/B&B/Pharmacy",
  "Supplements & Foods",
  "Pure",
  "Sei Bella",
];
const projectTypeOptions = ["Website/Digital", "Print", "Social"];

export default function App() {
  const [rules, setRules] = useState([]);
  const [inputs, setInputs] = useState({ country: [], category: [], projectType: [] });
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.json())
      .then((data) => setRules(data))
      .catch(console.error);
  }, []);

  const handleChange = (field, value) => {
    setInputs({ ...inputs, [field]: value });
  };

  const handleSearch = () => {
    const countryInput = inputs.country.map((c) => c.toLowerCase());
    const categoryInput = inputs.category.map((c) => c.toLowerCase());
    const projectInput = inputs.projectType.map((p) => p.toLowerCase());

    const filtered = rules.filter((rule) => {
      const ruleCountries = rule.country ? rule.country.split(",").map(c => c.trim().toLowerCase()) : [];
      const ruleCategories = rule.category ? rule.category.split(",").map(c => c.trim().toLowerCase()) : [];
      const ruleProjectTypes = rule.projectType ? rule.projectType.split(",").map(p => p.trim().toLowerCase()) : [];

      const matchesCountry = ruleCountries.length === 0 || countryInput.some(input => ruleCountries.includes(input));
      const matchesCategory = ruleCategories.length === 0 || categoryInput.some(input => ruleCategories.includes(input));
      const matchesProjectType = ruleProjectTypes.length === 0 || projectInput.some(input => ruleProjectTypes.includes(input));

      return matchesCountry && matchesCategory && matchesProjectType;
    });

    setResults(filtered);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Fusion Proofing Assignment Tool</h1>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label>Country Stakeholder</label>
          <MultiSelect options={countryOptions} selected={inputs.country} onChange={(val) => handleChange("country", val)} />
        </div>
        <div>
          <label>Category(s)</label>
          <MultiSelect options={categoryOptions} selected={inputs.category} onChange={(val) => handleChange("category", val)} />
        </div>
        <div>
          <label>Project Type</label>
          <MultiSelect options={projectTypeOptions} selected={inputs.projectType} onChange={(val) => handleChange("projectType", val)} />
        </div>
        <button onClick={handleSearch}>Find Assignments</button>
      </div>
      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-4">Matching Assignments</h2>
          <ul>
            {results.map((r, idx) => (
              <li key={idx}>
                <strong>Name:</strong> {r.name} — <strong>Team:</strong> {r.team}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
