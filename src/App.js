import { useState, useEffect } from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
  const [name, setName] = useState('');
  const [identification, setIdentification] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState("");
  const [message, setMessage] = useState('');
  const [messagebim, setMessageIbm] = useState('');
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [recommendations, setRecommendations] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/person')
      .then(response => {
        setPersons(response.data);
        setFilteredPersons(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setFilteredPersons(persons.filter(person => person && person.name && person.name.toLowerCase().includes(searchName.toLowerCase())));
  }, [searchName, persons]);
  

  function calculateIbm(weight, height) {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height); 

    if (!weightNum || !heightNum) {
      setMessageIbm("Por favor, ingrese números válidos para el peso y la altura");
      return null;
    }

    const bmi = weightNum / (heightNum * heightNum);
    setMessageIbmMessage(bmi.toFixed(2));
    return bmi;
  }

  function setMessageIbmMessage(bmiResult) {

    // switch (true) {
    //   case bmiResult <= 18.5:
    //     setMessageIbm('la persona tiene desnutricion');
    //     break;
    //   case bmiResult >= 18.5 && bmiResult < 25:
    //       setMessageIbm('bajo_peso');
    //       break;
    //   case bmiResult >= 25 && bmiResult < 30:
    //       setMessageIbm('peso_normal');
    //       break;
    //   case bmiResult >= 30 && bmiResult < 40:
    //       setMessageIbm('problemas_obesidad');
    //       break;
    //   case bmiResult  >= 40:
    //       setMessageIbm('obesidad_severa');
    //       break;
    //       default:
    //       break;
    // }
    if (bmiResult <= 18.5) {
      setMessageIbm('La persona tiene desnutrición');
    } else if (bmiResult >= 18.5 && bmiResult < 25) {
      setMessageIbm('La persona tiene bajo peso');
    } else if (bmiResult >= 25 && bmiResult < 30) {
      setMessageIbm('La persona tiene peso normal');
    } else if (bmiResult >= 30 && bmiResult < 40) {
      setMessageIbm('La persona tiene problemas de obesidad');
    } else if (bmiResult >= 40){
      setMessageIbm('La persona tiene obesidad severa');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const calculatedIbm = calculateIbm(weight, height);

      if (calculatedIbm === null) return;

      const response = await axios.post('http://localhost:5000/api/person', {
        name,
        identification: parseInt(identification),
        age: parseInt(age),
        gender,
        weight: parseFloat(weight),
        height: parseFloat(height),        
        bmiResult: calculatedIbm.toFixed(2)
      });

      setMessage(response.data.message);
      setName('');
      setIdentification('');
      setAge('');
      setGender('');
      setWeight('');
      setHeight('');     
      setBmiResult(calculatedIbm.toFixed(2));
      setPersons([...persons, response.data.person]);
    } catch (error) {
      console.error(error);
      setMessage('Error al enviar los datos');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/person/${id}`);
      setPersons(persons.filter(person => person._id !== id));
      setFilteredPersons(filteredPersons.filter(person => person._id !== id));
    } catch (error) {
      console.error(error);
      setMessage('Error al eliminar los datos');
    }
  };

  const handleSelect = (person) => {
    setSelectedPerson(person);
    setName(person.name);
    setIdentification(person.identification.toString());
    setAge(person.age.toString());
    setGender(person.gender);
    setWeight(person.weight.toString());
    setHeight(person.height.toString());
    setBmiResult(person.bmiResult.toString());
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        name,
        identification: parseInt(identification),
        age: parseInt(age),
        gender,
        weight: parseFloat(weight),
        height: parseFloat(height),
        bmiResult: calculateIbm(weight, height)
      };

      if (updatedData.bmiResult === null) return;

      await axios.put(`http://localhost:5000/api/person/${selectedPerson._id}`, updatedData);
      setMessage('Datos actualizados correctamente');
      setName('');
      setIdentification('');
      setAge('');
      setGender('');
      setWeight('');
      setHeight('');
      setBmiResult('');
      setSelectedPerson(null);
    } catch (error) {
      console.error(error);
      setMessage('Error al actualizar los datos');
    }
  };
  const handleRecommendations = (bmiResult) => {
    console.log("Valor original de bmiResult:", bmiResult);
    const bmi = parseFloat(bmiResult);
    console.log("Valor de bmiResult como número:", bmi);
  
    if (isNaN(bmi)) {
      console.log("El valor de bmiResult no es un número válido");
      setModalTitle('Error');
      setRecommendations('No se puede calcular las recomendaciones porque el valor de IMC no es válido.');
      return;
    }
  
    if (bmi <= 18.5) {
      console.log("Configurando recomendaciones para desnutrición");
      setModalTitle('Recomendaciones para Personas en Desnutrición');
      setRecommendations(
        'Para las personas en desnutrición, es crucial enfocarse en una alimentación rica en nutrientes que incluya proteínas, vitaminas y minerales esenciales. Aquí tienes algunos consejos:<br><br>' +
        '<strong>1. Alimentos ricos en proteínas:</strong> Incorpora carnes magras, pescado, huevos, legumbres, y productos lácteos para ayudar en la reparación y crecimiento de tejidos.<br>' +
        '<br>' +
        '<strong>2. Frutas y verduras:</strong> Consume una variedad de frutas y verduras para obtener vitaminas y minerales esenciales.<br>' +
        '<br>' +
        '<strong>3. Grasas saludables:</strong> Incluye fuentes de grasas saludables como aguacate, nueces, semillas y aceites vegetales.<br>' +
        '<br>' +
        '<strong>4. Pequeñas comidas frecuentes:</strong> Realiza comidas pequeñas y frecuentes para mejorar la ingesta calórica sin sobrecargar el sistema digestivo.<br>' +
        '<br>' +
        '<strong>5. Suplementos:</strong> Considera el uso de suplementos vitamínicos y minerales bajo la supervisión de un profesional de la salud.<br>'+
        '<br>'+
        '<a href="https://www.unicef.es/noticia/desnutricion-infantil-como-puedo-ayudar" target="_blank">Para más Ayuda</a><br>'
      );
    } else if (bmi > 18.5 && bmi < 25) {
      console.log("Configurando recomendaciones para bajo peso");
      setModalTitle('Recomendaciones para Personas con Bajo Peso');
      setRecommendations(
        'Para personas con bajo peso, es importante enfocarse en una alimentación que promueva un aumento de peso gradual y saludable. Aquí tienes algunos consejos:<br><br>' +
        '<strong>1. Aumenta la ingesta calórica:</strong> Consume alimentos densos en calorías como nueces, aguacates, aceites saludables y productos lácteos enteros.<br>' +
        '<br>' +
        '<strong>2. Incorpora proteínas de alta calidad:</strong> Opta por fuentes magras de proteínas como pollo, pescado, huevos, legumbres y productos lácteos.<br>' +
        '<br>' +
        '<strong>3. Come con frecuencia:</strong> Realiza varias comidas pequeñas y refrigerios nutritivos a lo largo del día para aumentar la ingesta calórica total.<br>' +
        '<br>' +
        '<strong>4. Añade carbohidratos complejos:</strong> Incluye alimentos ricos en carbohidratos complejos como cereales integrales, arroz integral, quinoa y batatas para obtener energía sostenida.<br>' +
        '<br>' +
        '<strong>5. No te saltes las comidas:</strong> Es importante no saltarse ninguna comida y asegurarse de tener una alimentación equilibrada durante todo el día.'
      );
    } else if (bmi >= 25 && bmi < 30) {
      console.log("Configurando recomendaciones para peso normal");
      setModalTitle('Recomendaciones para Personas con Peso Normal');
      setRecommendations(
        'Para personas con un peso normal, pueden incluir estos concejos en sus rutinas:<br><br>' +
        '<strong>1. Variedad y moderación:</strong> Prioriza una dieta variada que incluya una amplia gama de alimentos de todos los grupos alimenticios, como frutas, verduras, granos enteros, proteínas magras y grasas saludables. Mantén el equilibrio y la moderación en tus porciones para evitar excesos.<br>' +
        '<br>' +
        '<strong>2. Hidratación adecuada:</strong> Bebe suficiente agua a lo largo del día para mantener la hidratación adecuada. Limita el consumo de bebidas azucaradas y alcohol, y opta por agua, infusiones de hierbas o agua con sabor natural.<br>' +
        '<br>' +
        '<strong>3. Actividad física regular:</strong> Combina una alimentación saludable con actividad física regular para mantener un peso equilibrado y promover la salud en general. Encuentra actividades que disfrutes, como caminar, nadar, hacer yoga o bailar, y hazlas parte de tu rutina diaria.<br>' +
        '<br>'
      );
    } else if (bmi >= 30 && bmi < 40) {
      console.log("Configurando recomendaciones para problemas de obesidad");
      setModalTitle('Recomendaciones para Personas con Problemas de Obesidad');
      setRecommendations(
        'Para personas con problemas de obesidad, es importante enfocarse en una alimentación que promueva un aumento de peso gradual y saludable:<br><br>' +
        '<strong>1. Control de porciones y frecuencia de comidas:</strong> Opta por porciones más pequeñas y come con más frecuencia a lo largo del día para evitar picar entre comidas. Esto puede ayudar a mantener estables los niveles de azúcar en la sangre y reducir los antojos.<br>' +
        '<br>' +
        '<strong>2. Prioriza alimentos integrales y frescos:</strong> Reduce el consumo de alimentos procesados y ricos en grasas saturadas y azúcares añadidos. En su lugar, elige alimentos integrales como frutas, verduras, granos enteros, proteínas magras y grasas saludables.<br>' +
        '<br>' +
        '<strong>3. Planificación de comidas y registro de alimentos:</strong> Planifica tus comidas con anticipación y lleva un registro de lo que comes. Esto puede ayudarte a ser más consciente de tus elecciones alimenticias y a identificar patrones problemáticos. Además, considera buscar apoyo profesional de un dietista o nutricionista para desarrollar un plan de alimentación personalizado y sostenible.<br>' +
        '<br>'
      );
    } else if (bmi >= 40) {
      console.log("Configurando recomendaciones para obesidad severa");
      setModalTitle('Recomendaciones para Personas con Obesidad Severa');
      setRecommendations(
        'Para personas con obesidad severa, es fundamental adoptar hábitos alimenticios que promuevan la pérdida de peso de manera segura y sostenible:<br><br>' +
        '<strong>1. Consulta a un profesional de la salud:</strong> Busca la orientación de un médico especializado en obesidad o un dietista registrado. Ellos pueden ayudarte a desarrollar un plan de alimentación personalizado que se adapte a tus necesidades específicas, considerando tu salud general y cualquier condición médica subyacente.<br>' +
        '<br>' +
        '<strong>2. Prioriza alimentos nutritivos y bajos en calorías:</strong> Elige alimentos ricos en nutrientes y bajos en calorías, como frutas, verduras, proteínas magras y granos enteros. Limita el consumo de alimentos procesados, ricos en grasas saturadas y azúcares añadidos.<br>' +
        '<br>' +
        '<strong>3. Control de porciones y registro de alimentos:</strong> Controla el tamaño de las porciones y lleva un registro de lo que comes. Esto te ayudará a ser más consciente de tus hábitos alimenticios y a identificar áreas en las que puedes realizar cambios para mejorar tu dieta y alcanzar tus objetivos de pérdida de peso.<br>' +
        '<br>'+
        'Recuerda que la pérdida de peso sostenible generalmente se logra a través de cambios de estilo de vida a largo plazo, que incluyen una alimentación saludable y equilibrada, actividad física regular y apoyo emocional.<br>' +
        '<br>'+
        '<a href="https://www.icbf.gov.co/bienestar/nutricion/educacion-alimentaria" target="_blank">Para más Ayuda</a><br>'
      );
    } else {
      console.log("No se encontró un caso coincidente");
      setModalTitle('Error');
      setRecommendations('No se puede calcular las recomendaciones porque el valor de IMC no es válido.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Gestión de Índice de Masa Corporal</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre: </label>
          <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="identification" className="form-label">Identificación: </label>
          <input type="number" className="form-control" id="identification" value={identification} onChange={(e) => setIdentification(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">Edad: </label>
          <input type="number" className="form-control" id="age" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Género:</label>
          <select className="form-select" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option disabled value="">--Seleccionar--</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="weight" className="form-label">Peso (kg): </label>
          <input type="number" className="form-control" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="height" className="form-label">Estatura (metros): </label>
          <input type="number" className="form-control" id="height" value={height} onChange={(e) => setHeight(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="bmiResult" className="form-label">IMC: </label>
          <input type="number" className="form-control" id="bmiResult" value={bmiResult} readOnly />
        </div>
        <span>
          <p className="negrita">{messagebim}</p>
          </span>
        <button type="submit" className="btn btn-primary">Guardar Datos</button>
        {selectedPerson && (
          <button type="button" className="btn btn-warning ms-2" onClick={handleUpdate}>Actualizar Datos</button>
        )}
        {message && <p className="mt-2">{message}</p>}
      </form>
      <hr />

      <h2 className="mt-4">Buscar Persona por Nombre</h2>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Ingrese el nombre de la persona" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
      </div>
      <hr />

      <h2 className="mt-4">Personas Registradas</h2>
      <ul className="list-group mt-3">
        {filteredPersons.length > 0 ? (
          filteredPersons.map((person, index) => (
            person && person.name ? (
              <div className="mb-3" key={index}>
              <li  className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <div><strong>Nombre: </strong> {person.name}</div>
                  <div><strong>Identificación: </strong> {person.identification}</div>
                  <div><strong>Edad:</strong> {person.age}</div>
                  <div><strong>Género:</strong> {person.gender}</div>
                  <div><strong>IMC:</strong> {person.bmiResult}</div>
                </div>
                <div>
                  <button type="button" className="btn btn-info me-2" onClick={() => handleSelect(person)}>Editar</button>
                  <button type="button" className="btn btn-danger" onClick={() => handleDelete(person._id)}>Eliminar</button>
                  <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#recommendationsModal" onClick={() => handleRecommendations(person.bmiResult)}>Recomendaciones</button>
                </div>
              </li>
              </div>
            ) : null
          ))
        ) : (
          <p>No hay personas registradas.</p>
        )}
      </ul>
      <div className="modal fade" id="recommendationsModal" tabIndex="-1" aria-labelledby="recommendationsModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="recommendationsModalLabel">{modalTitle}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div  className="modal-body" dangerouslySetInnerHTML={{ __html: recommendations }} />
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
