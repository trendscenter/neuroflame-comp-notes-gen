import React from 'react';
import SectionInput from './SectionInput';

interface Row {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  column5: string;
  column6: boolean;
}

interface Props {
  data: Row[];
  setData: (data: Row[]) => void;
}

export default function DynamicTable({ data, setData }: Props) {
  const handleChange = (index: number, field: keyof Row, value: string) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const toggleValue = (index: number, field: keyof Row) => {
    const updated = [...data];
    updated[index][field] = !updated[index][field];
    setData(updated);
  };

  const addRow = () => {
    setData([...data, { column1: '', column2: '', column3: '', column4: '', column5: '', column6: false }]);
  };

  const removeRow = (index: number) => {
    const updated = data.filter((_, i) => i !== index);
    setData(updated);
  };

  return (
    <div style={{ 
      marginBottom: '1rem', 
      paddingBottom: '1rem', 
      overflow: 'scroll', 
      height: '400px', 
      width: '100%'
    }}>
      <table style={{ width: '100%' }}>
      <thead>
        <tr>
          {['Variable Name', 'Type', 'Description', 'Allowed Options', 'Default', 'Required'].map((heading, i) => (
            <th
              key={i}
              style={{
                position: 'sticky',
                top: 0,
                backgroundColor: '#fff',
                borderBottom: '1px solid #000',
                zIndex: 1,
                padding: '0.5rem'
              }}
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.column1}
                  onChange={(e) => handleChange(index, 'column1', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.column2}
                  onChange={(e) => handleChange(index, 'column2', e.target.value)}
                />
              </td>
              <td style={{minWidth: '250px'}}>
                <SectionInput
                  value={row.column3}
                  onChange={(val) => handleChange(index, 'column3', val)}
                  table={true}
                />
              </td>
              <td style={{minWidth: '250px'}}>
               <SectionInput
                  value={row.column4}
                  onChange={(val) => handleChange(index, 'column4', val)}
                  table={true}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.column5}
                  onChange={(e) => handleChange(index, 'column5', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={row.column6}
                  onChange={() => toggleValue(index, 'column6')}
                  style={{ marginRight: '0.5rem' }}
                />
              </td>
              <td>
                <button onClick={() => removeRow(index)} className='btn-grey'>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow} style={{ marginTop: '0.5rem' }}>Add Row</button>
    </div>
  );
}