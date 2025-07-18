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
    setSections(prev =>
      prev.map((section, i) =>
        i === index ? { ...section, content: value } : section
      )
    );
  };

  const saveSection = (index: number) => {
    setSections(prev =>
      prev.map((section, i) =>
        i === index ? { ...section, saved: section.content } : section
      )
    );
  };

  const toggleSectionVisibility = (index: number) => {
    setSections(prev =>
      prev.map((section, i) =>
        i === index ? { ...section, hidden: !section.hidden } : section
      )
    );
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

  return (
    <div className="app-container">
      <h1>Computation Notes Builder</h1>

      <div style={{ display: 'flex', flexDirection: 'row', columnGap: '1rem' }}>
        <div style={{ flex: 0.4 }}>
          <div style={{ position: 'fixed', width: 'calc(40% - 2rem)' }}>
            {step === 0 && (
              <SectionInput
                label="Overview"
                value={sections[0].content}
                onChange={(val) => updateSection(0, val)}
                onSave={() => {
                  saveSection(0);
                  setStep(1);
                }}
              />
            )}

            {step === 1 && (
              <SectionInput
                label="Example Settings"
                value={sections[1].content}
                isCode
                onChange={(val) => updateSection(1, val)}
                onSave={() => {
                  saveSection(1);
                  setStep(2);
                }}
              />
            )}

            {step === 2 && (
              <>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <h2>{sections[2].label}</h2>
                  <button
                    onClick={prefillTableFromExampleSettings}
                    style={{ marginTop: '1rem', marginBottom: '1rem' }}
                    className="btn-blue"
                  >
                    Pre-fill from Example Settings
                  </button>
                </div>
                <DynamicTable data={tableData} setData={setTableData} />
                <button style={{ marginTop: '1rem' }} onClick={() => setStep(3)}>
                  Next
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <SectionInput
                  label="Algorithm Description"
                  value={sections[3].content}
                  onChange={(val) => updateSection(3, val)}
                  onSave={() => {
                    saveSection(3);
                    setStep(4);
                  }}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={sections[3].hidden}
                    onChange={() => toggleSectionVisibility(3)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Hide Section
                </label>
              </>
            )}

            {step === 4 && (
              <>
                <SectionInput
                  label="Assumptions"
                  value={sections[4].content}
                  onChange={(val) => updateSection(4, val)}
                  onSave={() => {
                    saveSection(4);
                    setStep(5);
                  }}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={sections[4].hidden}
                    onChange={() => toggleSectionVisibility(4)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Hide Section
                </label>
              </>
            )}

            {step === 5 && (
              <>
                <SectionInput
                  label="Output Description"
                  value={sections[5].content}
                  onChange={(val) => updateSection(5, val)}
                  onSave={() => {
                    saveSection(5);
                    setStep(6);
                  }}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={sections[5].hidden}
                    onChange={() => toggleSectionVisibility(5)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Hide Section
                </label>
              </>
            )}

            {step === 6 && (
              <>
                <SectionInput
                  label="TODOs"
                  value={sections[6].content}
                  onChange={(val) => updateSection(6, val)}
                  onSave={() => {
                    saveSection(6);
                  }}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={sections[6].hidden}
                    onChange={() => toggleSectionVisibility(6)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Hide Section
                </label>
              </>
            )}

            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                Previous
              </button>
              <span style={{ margin: '0 1rem' }}>
                Step {step + 1} of {sectionLabels.length}
              </span>
              <button
                onClick={() => setStep((s) => Math.min(sectionLabels.length - 1, s + 1))}
                disabled={step === sectionLabels.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div style={{ flex: 0.6 }}>
          <MarkdownConverter
            sections={sections.map(({ label, saved, content, hidden }) => ({
              label,
              content: saved || content,
              hidden
            }))}
            tableData={tableData}
            showConvertButton={step === 6}
          />
        </div>
      </div>
    </div>
  );
}
