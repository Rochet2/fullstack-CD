import React from 'react';

const Input = p => {
    const variableName = p.field.variableName
    return (
        <tr>
            <td><label>{p.field.label}</label>:</td>
            <td><input value={p.state[variableName]} onChange={p.onChange(variableName)} /></td>
        </tr>
    )
}
const Kaavake = p => {
    const fields = p.fields
    return (
        <div>
            <h2>Lisää uusi</h2>
            <form onSubmit={p.onSubmit}>
                <table>
                    <tbody>
                        {fields.map(f => <Input key={f.variableName} state={p.state} field={f} onChange={p.onChange} />)}
                    </tbody>
                </table>
                <div>
                    <button type="submit">lisää</button>
                </div>
            </form>
        </div>
    )
}

export default Kaavake
