import React, { useState } from 'react';
import { useNavigate, useParams  ,useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import ApiManager from '../../api';

function AddPlanningForm() {


    const sportId = new URLSearchParams(useLocation().search).get("id");
   
    const [day, setDay] = useState(0);
    const [timeRanges, setTimeRanges] = useState([{ hourStart: '', hourEnd: '' }]);
    // const [dateCreation, setDateCreation] = useState(new Date().toISOString());
  
    console.log(sportId);
    
    // Helper function to convert day number to day name
  const getDayName = (day) => {
    switch (day) {
      case 0:
        return "Lundi";
      case 1:
        return "Mardi";
      case 2:
        return "Mercredi";
      case 3:
        return "Jeudi";
      case 4:
        return "Vendredi";
      case 5:
        return "Samedi";
      case 6:
        return "Dimanche";
      default:
        return "Unknown Day";
    }
  };
    
    
    const navigate = useNavigate();
  const handleTimeRangeChange = (index, field, value) => {
    const newTimeRanges = [...timeRanges];
    newTimeRanges[index][field] = value;
    setTimeRanges(newTimeRanges);
  };

  const addTimeRange = () => {
    setTimeRanges([...timeRanges, { hourStart: '', hourEnd: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const planningData = {
      sportId,
      day: parseInt(day, 10),
      timeRanges,
      dateCreation: new Date().toISOString(),
    };
  
    try {
      const response = await ApiManager.post('/Plannings/add-planning', planningData);
  
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Planning ajouté avec succès!",
          icon: "success",
        });
        navigate(`/planning-list?id=${sportId}`);
      } else {
        alert('Failed to add planning');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: "Erreur réseau!",
        text: error.message,
        icon: "error",
      });
    }
  };


  const handleRemoveTimeRange = async (index) => {
  

        setTimeRanges(timeRanges.filter((_, i) => i !== index));
    
        console.log("index of time exact" ,index);
     
        
  
  };

  const handleCancel = () => {
    navigate(`/planning-list?id=${sportId}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {/* <label>Sport ID: {sportId}</label> */}
       
      </div>

      <div>
        <label>Day:</label>
        <select value={day}  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary" onChange={(e) => setDay(parseInt(e.target.value))} required>
          <option value={0}>{getDayName(0)}</option>
          <option value={1}>{getDayName(1)}</option>
          <option value={2}>{getDayName(2)}</option>
          <option value={3}>{getDayName(3)}</option>
          <option value={4}>{getDayName(4)}</option>
          <option value={5}>{getDayName(5)}</option>
          <option value={6}>{getDayName(6)}</option>
        </select>
      </div>

      <div>
        <label>Time Ranges:</label>
        {timeRanges.map((range, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <div className="flex items-center space-x-4">
            <label className="mb-2.5 block text-black dark:text-white">Start Time:</label>
            <input
            className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition"
              type="time"
              value={range.hourStart}
              onChange={(e) => handleTimeRangeChange(index, 'hourStart', e.target.value)}
              required
            />
            <label className="mb-2.5 block text-black dark:text-white">End Time:</label>
            <input
            className="w-full rounded-[4px] border-[1px] border-[#E0E0E0] text-[16px] bg-[#FFFFFF] py-3 px-5 text-[#424242] outline-none transition"
              type="time"
              value={range.hourEnd}
              onChange={(e) => handleTimeRangeChange(index, 'hourEnd', e.target.value)}
              required
            />
              <button type="button" className="flex ml-auto justify-right rounded bg-danger py-2 px-6 font-medium text-white hover:bg-opacity-90" onClick={() => handleRemoveTimeRange(index)}>
           Remove
            </button>
          </div>
          </div>
         
        ))}
        <button type="button" className="flex justify-left rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90" onClick={addTimeRange}> Ajouter Time </button>
        <div className="flex justify-end gap-4.5">
        <button
        type="button"
        className="flex justify-center rounded bg-meta-1 py-2 px-6 font-medium text-white hover:bg-opacity-90"
        onClick={handleCancel}
      >
        Annuler
      </button>
       <button type="submit" className="flex justify-left rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"> Ajouter</button>
      </div>
      </div>

      

    </form>
  );
}

export default AddPlanningForm;
