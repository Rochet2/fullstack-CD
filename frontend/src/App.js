import React from 'react';
import Dbo from './components/Dbo';
import Numerot from './components/Numerot';
import Kaavake from './components/Kaavake';
import { Notification, Error } from './components/Notification';
import './index.css'

const Input = p => {
  const variableName = p.variable
  return (
    <div>
      <label>{p.label}:</label> <input value={p.state[variableName]} onChange={p.onChange(variableName)} />
    </div>)
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNumber: '',
      search: '',
      error: null,
      notification: null,
    }
    this.fields = [
      { label: "nimi", variableName: "newName" },
      { label: "numero", variableName: "newNumber" },
    ]
  }

  componentWillMount() {
    Dbo.getAll().then(persons => this.setState({ persons }))
  }

  onSubmit = (event) => {
    event.preventDefault()

    const entry = {
      name: this.state.newName,
      number: this.state.newNumber,
      date: new Date().new,
    }

    const create = () =>
      Dbo.create(entry)
        .then(entry => this.notify("Luonti onnistui", { persons: this.state.persons.concat(entry) }))
        .catch(d => this.error("Tapahtui virhe"))

    const existing = this.state.persons.filter(p => p.name === entry.name)
    if (existing.length !== 0) {
      if (!window.confirm("Korvataanko olemassa oleva?"))
        return
      const id = existing[0].id
      Dbo.update(id, entry)
        .then(entry => this.notify("Päivitys onnistui", old => ({
          persons: this.state.persons.map(o => o.id === id ? entry : o)
        })))
        .catch(d => {
          this.setState(old => ({
            persons: old.persons.filter(p => p.id !== id)
          }))
          create()
        })
    }
    else {
      create()
    }

    this.setState({
      newName: '',
      newNumber: '',
    })
  }

  onChange = () => (field) => (event) => {
    this.setState({ [field]: event.target.value })
  }

  onRemove = () => (id) => () => {
    if (!window.confirm("Poista?"))
      return;
    Dbo
      .remove(id)
      .then((data) => {
        this.notify("Poisto onnistui", (old) => ({ persons: old.persons.filter(p => p.id !== id) }))
      })
      .catch(d => this.error("Tapahtui virhe"))
  }

  error = (error, newState) => {
    this.setState({ error })
    this.setState(newState)
    setTimeout(() => {
      if (this.state.error === error)
        this.setState({ error: null })
    }, 5000)
  }

  notify = (notification, newState) => {
    this.setState({ notification })
    this.setState(newState)
    setTimeout(() => {
      if (this.state.notification === notification)
        this.setState({ notification: null })
    }, 5000)
  }

  render() {
    return (
      <div>
        <Error message={this.state.error} />
        <Notification message={this.state.notification} />
        <h2>Puhelinluettelo</h2>
        <Input state={this.state} label="Hae" variable="search" onChange={this.onChange()} />
        <Kaavake state={this.state} onSubmit={this.onSubmit} fields={this.fields} onChange={this.onChange()} />
        <Numerot state={this.state} onRemove={this.onRemove()} />
      </div>
    )
  }
}

export default App
