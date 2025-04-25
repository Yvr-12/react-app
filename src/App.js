import { useEffect, useState } from 'react';
import './styles.css';

const specialtiesList = [
  'General Physician', 'Dentist', 'Dermatologist', 'Paediatrician',
  'Gynaecologist', 'ENT', 'Diabetologist', 'Cardiologist',
  'Physiotherapist', 'Endocrinologist', 'Orthopaedic',
  'Ophthalmologist', 'Gastroenterologist', 'Pulmonologist',
  'Psychiatrist', 'Urologist', 'Dietitian/Nutritionist',
  'Psychologist', 'Sexologist', 'Nephrologist', 'Neurologist',
  'Oncologist', 'Ayurveda', 'Homeopath'
];

export default function App() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
      .then(res => res.json())
      .then(data => setDoctors(data.doctors || []))
      .catch(() => setError('Failed to fetch doctors'))
      .finally(() => setLoading(false));
  }, []);

  const filteredDoctors = doctors
    .filter(doc =>
      (!consultation || doc.consultationType === consultation) &&
      (specialties.length === 0 || specialties.every(sp => doc.specialties.includes(sp))) &&
      (search === '' || doc.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === 'fees') return a.fees - b.fees;
      if (sort === 'experience') return b.experience - a.experience;
      return 0;
    });

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="doctor-listing">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search doctors..."
        />
      </div>

      {/* Filters */}
      <div className="filters">
        {/* Consultation Type */}
        <div>
          <h3>Consultation Type</h3>
          <label>
            <input
              type="radio"
              name="consultation"
              value="Video Consult"
              checked={consultation === 'Video Consult'}
              onChange={e => setConsultation(e.target.value)}
            />
            Video Consult
          </label>
          <label>
            <input
              type="radio"
              name="consultation"
              value="In Clinic"
              checked={consultation === 'In Clinic'}
              onChange={e => setConsultation(e.target.value)}
            />
            In Clinic
          </label>
          <label>
            <input
              type="radio"
              name="consultation"
              value=""
              checked={consultation === ''}
              onChange={e => setConsultation('')}
            />
            All
          </label>
        </div>

        {/* Specialties */}
        <div>
          <h3>Specialties</h3>
          {specialtiesList.map(specialty => (
            <label key={specialty}>
              <input
                type="checkbox"
                value={specialty}
                checked={specialties.includes(specialty)}
                onChange={e => {
                  if (e.target.checked) {
                    setSpecialties([...specialties, specialty]);
                  } else {
                    setSpecialties(specialties.filter(sp => sp !== specialty));
                  }
                }}
              />
              {specialty}
            </label>
          ))}
        </div>

        {/* Sorting */}
        <div>
          <h3>Sort By</h3>
          <label>
            <input
              type="radio"
              name="sort"
              value="fees"
              checked={sort === 'fees'}
              onChange={e => setSort(e.target.value)}
            />
            Fees (Low to High)
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="experience"
              checked={sort === 'experience'}
              onChange={e => setSort(e.target.value)}
            />
            Experience (High to Low)
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value=""
              checked={sort === ''}
              onChange={e => setSort('')}
            />
            None
          </label>
        </div>
      </div>

      {/* Doctor List */}
      <div className="doctor-list">
        {filteredDoctors.map(doc => (
          <div key={doc.id} className="doctor-card">
            <img
              src={doc.image || 'https://via.placeholder.com/80?text=Dr'}
              alt={doc.name}
              className="doctor-img"
              style={{ borderRadius: '50%', width: 80, height: 80, objectFit: 'cover', marginRight: 16 }}
            />
            <div>
              <h3>{doc.name}</h3>
              <div>{doc.specialties.join(', ')}</div>
              <div>{doc.experience} yrs exp.</div>
              <div>₹{doc.fees}</div>
              <button style={{ marginTop: 8 }}>Book Appointment</button>
            </div>
          </div>
        ))}
        {filteredDoctors.length === 0 && (
          <div className="no-results">No doctors found for your criteria.</div>
        )}
      </div>
    </div>
  );
}
