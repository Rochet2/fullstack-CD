import React from 'react';

const Numero = p => (
    <tr>
        <td>{p.person.name}</td>
        <td>{p.person.number}</td>
        <td><button onClick={p.onRemove(p.person.id)}>poista</button></td>
    </tr>
)
const Numerot = ({ state, onRemove }) => {
    // Move logic to app and pass only specific list of persons?
    let persons = state.persons
    if (state.search.length !== 0) {
        const search = state.search.toLowerCase()
        persons = persons.filter(p => p.name.toLowerCase().includes(search))
    }

    return (
        <div>
            <h2>Numerot</h2>
            <table>
                <tbody>
                    {persons.map(p => <Numero key={p.name} person={p} onRemove={onRemove} />)}
                </tbody>
            </table>
        </div>
    )
}

export default Numerot
