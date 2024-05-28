import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [name, setName] = useState('');
  const [identification, setIdentification] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [message, setMessage] = useState('');

  // State to store the list of registered persons
  const [persons, setPersons] = useState([]);
  
  // State to store the selected person for editing
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Load the list of persons
  useEffect(() => {
    axios.get('http://localhost:5000/api/person')
      .then(response => {
        setPersons(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // Function to calculate Body Mass Index
  const calculateIbm = (weight, height) => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // convert height to meters

    if (isNaN(weightNum) || isNaN(heightNum) || heightNum === 0) {
      setMessage('Please enter valid weight and height.');
      return null;
    }

    const bmi = weightNum / (heightNum * heightNum);
    setBmiResult(bmi.toFixed(2));

    if (bmi <= 18.5) {
      setMessage("Person has malnutrition");
    } else if (bmi < 25) {
      setMessage("Person underweights");
    } else if (bmi < 30) {
      setMessage("Person is okay");
    } else if (bmi < 40) {
      setMessage("Person with weight issues");
    } else {
      setMessage("Person overweight severely");
    }
    return bmi;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate BMI
      const ibm = calculateIbm(weight, height);

      if (ibm === null) {
        return;
      }

      // Send request to add a new person
      const response = await axios.post('http://localhost:5000/api/person', {
        name,
        identification: parseInt(identification),
        age: parseInt(age),
        gender,
        weight: parseFloat(weight),
        height: parseFloat(height),
        ibm: bmiResult // Include the BMI field in the request
      });

      setMessage(response.data.message);
      setName('');
      setIdentification('');
      setAge('');
      setGender('');
      setWeight('');
      setHeight('');
      setBmiResult(null); // Clear BMI result
      setPersons([...persons, response.data.person]); // Update the list with the new person
    } catch (error) {
      console.error(error);
      setMessage('Error al enviar los datos');
    }
  };

  // Function to handle deleting a person
  const handleDelete = async (id) => {
    try {
      // Send request to delete a person
      await axios.delete(`http://localhost:5000/api/person/${id}`);
      
      // Update the list of persons by removing the deleted person
      setPersons(persons.filter(person => person._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle selecting a person for editing
  const handleSelect = (person) => {
    // Set the selected person
    setSelectedPerson(person);
    
    // Set form fields with selected person's data
    setName(person.name);
    setIdentification(person.identification.toString());
    setAge(person.age.toString());
    setGender(person.gender);
    setWeight(person.weight.toString());
    setHeight(person.height.toString());
    setBmiResult(person.ibm.toString()); // Set the BMI value when selecting a person
  };

  // Function to handle updating a person's data
  const handleUpdate = async () => {
    try {
      // Calculate BMI
      const ibm = calculateIbm(weight, height);

      if (ibm === null) {
        return;
      }

      const updatedData = {
        name,
        identification: parseInt(identification),
        age: parseInt(age),
        gender,
        weight: parseFloat(weight),
        height: parseFloat(height),
        ibm: bmiResult // Update the BMI value
      };

      // Send request to update the selected person's data
      await axios.put(`http://localhost:5000/api/person/${selectedPerson._id}`, updatedData);

      // Update the message and reset form fields
      setMessage('Datos actualizados correctamente');
      setName('');
      setIdentification('');
      setAge('');
      setGender('');
      setWeight('');
      setHeight('');
      setBmiResult(''); // Clear BMI result after update
      setSelectedPerson(null);

      // Update the list of persons with the updated data
      setPersons(persons.map(person => (person._id === selectedPerson._id ? { ...person, ...updatedData } : person)));
    } catch (error) {
      console.error(error);
      setMessage('Error al actualizar los datos');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Gestión de Indice De Masa Corporal</h1>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre: </label>
          <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label htmlFor="identification" className="form-label">Identificacion: </label>
          <input type="number" className="form-control" id="identification" value={identification} onChange={(e) => setIdentification(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label htmlFor="age" className="form-label">Edad: </label>
          <input type="number" className="form-control" id="age" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Género:</label>
          <select className="form-select" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required >
            <option value="" disabled>--Seleccionar--</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="weight" className="form-label">Peso (kg): </label>
          <input type="number" className="form-control" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label htmlFor="height" className="form-label">Estatura (cm): </label>
          <input type="number" className="form-control" id="height" value={height} onChange={(e) => setHeight(e.target.value)} required />
        </div>

        {bmiResult && (
          <div>
            <h2>IMC Resultado: {bmiResult}</h2>
            <p>{message}</p>
          </div>
        )}

        {/* Botones de guardar y actualizar */}
        <button type="submit" className="btn btn-primary">Guardar Datos</button>
        {selectedPerson && (
          <button type="button" className="btn btn-warning ms-2" onClick={handleUpdate}>Actualizar Datos</button>
        )}
        {/* Mensaje de éxito o error */}
        {message && <p className="mt-2">{message}</p>}
      </form>
      <hr />

      {/* Lista de personas registradas */}
      <h2 className="mt-4">Personas Registradas</h2>
      <ul className="list-group mt-3">
        {persons.map(person => (
          <li key={person._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              {/* Datos de la persona */}
              <div><strong>Nombre: </strong> {person.name}</div>
              <div><strong>Identificacion: </strong> {person.identification}</div>
              <div><strong>Edad:</strong> {person.age}</div>
              <div><strong>Género:</strong> {person.gender}</div>
              <div><strong>IMC:</strong> {person.ibm}</div>
            </div>
            
            {/* Botones de editar y eliminar */}
            <div>
              <button type="button" className="btn btn-info me-2" onClick={() => handleSelect(person)}>Editar</button>
              <button type="button" className="btn btn-danger" onClick={() => handleDelete(person._id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
