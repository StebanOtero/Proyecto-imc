// import { useState } from "react";
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Result from "./Result";
// const BmiForm = () => {
//   const [name, setName] = useState('');
//   const [iden, setIden] = useState('');
//   const [age, setAge] = useState('');
//   const [gender, setGender] = useState('');
//   const [result, setResult] = useState();
//   const [message, setMessage] = useState('');
//   const [formIsValid, setformIsValid] = useState(true);
//   const [weight, setWeight] = useState("");
//   const [weightUnit, setWeightUnit] = useState("");
//   const [height, setHeight] = useState("");
//   const [heightUnit, setHeightUnit] = useState("");
//   const [BMIResult, setBMIResult] = useState('');
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/person', {
//         name,
//         iden: parseInt(iden),
//         age: parseInt(age),
//         gender,
//         weight: parseFloat(weight),
//         height: parseFloat(height),
//       });
//       setCalories(response.data.calories);
//       setMessage(response.data.message);
//     } catch (error) {
//       console.error(error);
//       setMessage('Error al enviar los datos');
//     }
//   };


//   return (
//     <div>
//       <form onSubmit={handleSubmit}>


//       <div className="mb-3">
//         <label htmlFor="name" className="form-label">Nombre: </label>
//         <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required></input>
//       </div>

//       <div className="mb-3">
//         <label htmlFor="iden" className="form-label">No. Identificación: </label>
//         <input type="number" className="form-control" id="iden" value={iden} onChange={(e) => setIden(e.target.value)} required></input>
//       </div>

//       <div className="mb-3">
//         <label htmlFor="age" className="form-label">Edad: </label>
//         <input type="number" className="form-control" id="age" value={age} onChange={(e) => setAge(e.target.value)} required></input>
//       </div>

//       <div className="mb-3">
//       <label htmlFor="gender" className="form-label">Género:</label>
//       <select className="form-select" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
//             <option selected disable>--Seleccionar--</option>
//             <option value="male">Masculino</option>
//             <option value="female">Femenino</option>
//       </select>
//       </div>

//       <div className="mb-3">
//         <label htmlFor="weight" className="form-label">Peso - (kg): </label>
//         <input id="weight" value={weight} className="form-control" onChange={(e) => setWeight(e.target.value)} type="text"></input>
//       </div>

//       <div className="mb-3">
//         <label htmlFor="height" className="form-label">Estatura - (cm): </label>
//         <input id="height" value={height} className="form-control" onChange={(e) => setHeight(e.target.value)} type="text"></input>
//       </div>

//         <button className="btn btn-warning btn-sm" type="submit">Calcular IMC</button>
//       </form>
//       {BMIResult && <p className="mt-4">IMC: {BMIResult} <strong>{result}</strong>.</p>}
//       {message && <p>{message}</p>}
//     </div>
//   );
// };
// export default BmiForm;
