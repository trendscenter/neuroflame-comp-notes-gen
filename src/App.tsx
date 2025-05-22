// src/App.tsx
import React, { useEffect, useState } from 'react';
import SectionInput from './components/SectionInput';
import DynamicTable from './components/DynamicTable';
import MarkdownConverter from './components/MarkdownConverter';

const sectionLabels = [
  'Overview',
  'Example Settings',
  'Settings Specification',
  'Algorithm Description',
  'Assumptions',
  'Output Description',
  'TODOs'
];

export default function App() {
  const [sections, setSections] = useState(
    sectionLabels.map(label => ({ label, content: '', saved: '', hidden: false }))
  );

  const [tableData, setTableData] = useState([
    { column1: '', column2: '', column3: '', column4: '', column5: '', column6: false }
  ]);

  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = document.getElementById(`section-${step}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step]);

  const updateSection = (index: number, value: string) => {
    const updated = [...sections];
    updated[index].content = value;
    setSections(updated);
  };

  const saveSection = (index: number) => {
    const updated = [...sections];
    updated[index].saved = updated[index].content;
    setSections(updated);
  };

  const toggleSectionVisibility = (index: number) => {
    const updated = [...sections];
    updated[index].hidden = !updated[index].hidden;
    setSections(updated);
  };

  const prefillTableFromExampleSettings = () => {
    try {
      const parsed = JSON.parse(sections[1].content);
      const newRows = Object.entries(parsed).map(([key, value]) => ({
        column1: key,
        column2: typeof value,
        column3: '',
        column4: '',
        column5: JSON.stringify(value),
        column6: false
      }));
      setTableData(newRows);
    } catch (err) {
      alert('Invalid JSON in Example Settings');
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, sectionLabels.length));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="app-container">
      <h1>Computation Notes Builder</h1>

      <div style={{ display: 'flex', flexDirection: 'row', columnGap: '2rem' }}>
        <div style={{ flex: 0.5 }}>
          <div style={{ position: 'fixed', width: 'calc(50% - 2rem)' }}>
            {step === 0 && (
              <>
                <SectionInput
                  label={sections[0].label}
                  value={sections[0].content}
                  onChange={(val) => updateSection(0, val)}
                  onSave={() => saveSection(0)}
                />
              </>
            )}

            {step === 1 && (
              <SectionInput
                label={sections[1].label}
                value={sections[1].content}
                onChange={(val) => updateSection(1, val)}
                isCode
                onSave={() => saveSection(1)}
              />
            )}

            {step === 2 && (
              <>
                <div style={{display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between'}}>
                <h2>{sections[2].label}</h2>
                <button onClick={prefillTableFromExampleSettings} style={{ marginTop: '1rem', marginBottom: '1rem' }} className="btn-blue">
                  Pre-fill from Example Settings
                </button>
                </div>
                <DynamicTable data={tableData} setData={setTableData} />
              </>
            )}

            {step >= 3 && step <= 6 && (
              <>
              <SectionInput
                label={sections[step].label}
                value={sections[step].content}
                onChange={(val) => updateSection(step, val)}
                onSave={() => saveSection(step)}
              />
              <label>
                <input
                  type="checkbox"
                  checked={sections[step].hidden}
                  onChange={() => toggleSectionVisibility(step)}
                  style={{ marginRight: '0.5rem' }}
                />
                Hide Section
              </label>
              </>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <button onClick={prevStep} disabled={step === 0}>Previous</button>
              <span style={{ margin: '0 1rem' }}>Step {step + 1} of 7</span>
              <button onClick={nextStep} disabled={step === 6}>Next</button>
            </div>

          </div>
        </div>

        <div style={{ flex: 0.5 }}>
          <MarkdownConverter
            sections={sections.map(({ label, saved, hidden }) => ({
              label,
              content: saved || '',
              hidden
            }))}
            tableData={tableData}
            showConvertButton={step === 8}
          />
        </div>
      </div>
    </div>
  );
}
