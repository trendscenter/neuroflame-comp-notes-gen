// src/components/MarkdownConverter.tsx
import React, { useRef, useState } from 'react';
import TurndownService from 'turndown';

interface Section {
  label: string;
  content: string;
  hidden?: boolean;
}

interface Row {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  column5: string;
  column6: boolean;
}

interface Props {
  sections: Section[];
  tableData: Row[];
  showConvertButton?: boolean;
}

export default function MarkdownConverter({ sections, tableData, showConvertButton = true }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [markdown, setMarkdown] = useState('');

  const convertToMarkdown = () => {
    const turndown = new TurndownService();

    let md = sections
      .map((section, i) => {
        if (i === 1) {
          return `### ${section.label}\n\n\
\`\`\`json\n${section.content}\n\`\`\``;
        }
        return `### ${section.label}\n\n${turndown.turndown(section.content)}`;
      })
      .join('\n\n');

    if (tableData.length > 0) {
      const headers = '| Variable Name | Type | Description | Allowed Options | Default |';
      const divider = '| --- | --- | --- | --- | --- |';
      const rows = tableData
        .map(row => `| ${row.column1 || ' '} | ${row.column2 || ' '} | ${turndown.turndown(row.column3 || '')} | ${turndown.turndown(row.column4 || '')} | ${row.column5 || ' '} |`)
        .join('\n');
      const tableMarkdown = `### Data Format Spefication\n\n${headers}\n${divider}\n${rows}`;

      const section2Index = md.indexOf('### Example Settings');
      if (section2Index !== -1) {
        md = md.slice(0, section2Index + '### Example Settings'.length) + '\n\n' + tableMarkdown + md.slice(section2Index + '### Example Settings'.length);
      } else {
        md += '\n\n' + tableMarkdown;
      }
    }

    setMarkdown(md);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown)
      .then(() => alert('Markdown copied to clipboard!'))
      .catch(() => alert('Failed to copy markdown.'));
  };

  return (
    <div>
      <h2>Preview</h2>
      <div ref={previewRef} style={{ padding: '1rem', border: '1px solid #ccc' }}>
        {sections.map((section, i) =>
          section.hidden ? null : (
            <div key={i} id={`section-${i}`} style={{ scrollMarginTop: '80px', marginBottom: '2rem' }}>
            <h3>{section.label}</h3>
            {i === 1 ? (
            <pre style={{ backgroundColor: '#f5f5f5', padding: '0.5rem' }}>
              <code>{section.content}</code>
            </pre>
            ) : i === 2 ? (
            <>
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
              <div style={{ maxHeight: '300px', maxWidth: '50vw', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ position: 'sticky', top: 0, background: '#fff', fontSize: '0.75rem' }}>Variable Name</th>
                      <th style={{ position: 'sticky', top: 0, background: '#fff', fontSize: '0.75rem' }}>Type</th>
                      <th style={{ position: 'sticky', top: 0, background: '#fff', fontSize: '0.75rem' }}>Description</th>
                      <th style={{ position: 'sticky', top: 0, background: '#fff', fontSize: '0.75rem' }}>Allowed Options</th>
                      <th style={{ position: 'sticky', top: 0, background: '#fff', fontSize: '0.75rem' }}>Default</th>
                      <th style={{ position: 'sticky', top: 0, background: '#fff', fontSize: '0.75rem' }}>Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, j) => (
                        row.column1 && <tr key={j} style={{fontSize: '0.8rem'}}>
                        <td style={{textAlign: 'left'}}><pre>{row.column1}</pre></td>
                        <td><pre>{row.column2}</pre></td>
                        <td style={{textAlign: 'left'}} dangerouslySetInnerHTML={{ __html: row.column3 }} />
                        <td style={{textAlign: 'left'}} dangerouslySetInnerHTML={{ __html: row.column4 }} />
                        <td>{row.column5 ? row.column5 : 'n/a'}</td>
                        <td>{row.column6 ?  '✅ true' : '❌ false'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            )}
          </div>
        )
      )}
    </div>


      {showConvertButton && (
        <>
          <button onClick={convertToMarkdown} style={{ marginTop: '1rem' }}>Convert to Markdown</button>
          <h2>Markdown Output</h2>
          <textarea
            value={markdown}
            readOnly
            rows={12}
            style={{ width: '100%', marginTop: '0.5rem' }}
          />
          <button onClick={handleCopy} style={{ marginTop: '0.5rem' }}>Copy Markdown</button>
        </>
      )}
    </div>
  );
}
