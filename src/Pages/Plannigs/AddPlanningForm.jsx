import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import ApiManager from '../../api';

function AddPlanningForm() {
  const [selectedHourStart, setSelectedHourStart] = useState("");
  const [selectedHourEnd, setSelectedHourEnd] = useState("");
  const [showHoursDropdownStart, setShowHoursDropdownStart] = useState([]);
  const [showHoursDropdownEnd, setShowHoursDropdownEnd] = useState([]);
  const sportId = new URLSearchParams(useLocation().search).get("id");

  const [day, setDay] = useState(0);
  const [timeRanges, setTimeRanges] = useState([{ hourStart: '', hourEnd: '' }]);

  // Helper function to convert day number to day name
  const getDayName = (day) => {
    switch (day) {
      case 0: return "Dimanche";
      case 1: return "Lundi";
      case 2: return "Mardi";
      case 3: return "Mercredi";
      case 4: return "Jeudi";
      case 5: return "Vendredi";
      case 6: return "Samedi";
      default: return "Unknown Day";
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
    setShowHoursDropdownStart([...showHoursDropdownStart, false]); // Add state for new time range
    setShowHoursDropdownEnd([...showHoursDropdownEnd, false]);     // Add state for new time range
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
        text: error.response.data,
        icon: "error",
      });
    }
  };

  const handleRemoveTimeRange = (index) => {
    const newRanges = timeRanges.filter((_, i) => i !== index);
    setTimeRanges(newRanges);
    const newStartDropdown = showHoursDropdownStart.filter((_, i) => i !== index);
    const newEndDropdown = showHoursDropdownEnd.filter((_, i) => i !== index);
    setShowHoursDropdownStart(newStartDropdown);
    setShowHoursDropdownEnd(newEndDropdown);
  };

  const handleCancel = () => {
    navigate(`/planning-list?id=${sportId}`);
  };

  const handleHourStartChange = (index, event) => {
    const hour = event.target.value;
    setTimeRanges(prevState => {
      const updatedRanges = [...prevState];
      updatedRanges[index].hourStart = `${hour < 10 ? '0' + hour : hour}:00`;
      return updatedRanges;
    });
    setShowHoursDropdownStart(prevState => {
      const newState = [...prevState];
      newState[index] = false; // Close the dropdown after selecting
      return newState;
    });
  };

  const handleHourEndChange = (index, event) => {
    const hour = event.target.value;
    setTimeRanges(prevState => {
      const updatedRanges = [...prevState];
      updatedRanges[index].hourEnd = `${hour < 10 ? '0' + hour : hour}:00`;
      return updatedRanges;
    });
    setShowHoursDropdownEnd(prevState => {
      const newState = [...prevState];
      newState[index] = false; // Close the dropdown after selecting
      return newState;
    });
  };

  const toggleHoursDropdownStart = (index) => {
    setShowHoursDropdownStart(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index]; // Toggle visibility of the specific dropdown
      return newState;
    });
  };

  const toggleHoursDropdownEnd = (index) => {
    setShowHoursDropdownEnd(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index]; // Toggle visibility of the specific dropdown
      return newState;
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Day:</label>
          <select value={day}  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary" onChange={(e) => setDay(parseInt(e.target.value, 10))} required>
            <option value={6}>{getDayName(6)}</option>
            <option value={0}>{getDayName(0)}</option>
            <option value={1}>{getDayName(1)}</option>
            <option value={2}>{getDayName(2)}</option>
            <option value={3}>{getDayName(3)}</option>
            <option value={4}>{getDayName(4)}</option>
            <option value={5}>{getDayName(5)}</option>
          </select>
        </div>

        <h1>Select Hour</h1>
        <div>
          <label>Time Ranges:</label>
          {timeRanges.map((range, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <div className="flex items-center space-x-4">
                <label className="mb-2.5 block text-black">Start Time:</label>
                <div className="relative w-full">
                  <input
                    className="w-full rounded border border-[#E0E0E0] py-3 px-5"
                    type="time"
                    value={range.hourStart}
                    onChange={(e) => handleHourStartChange(index, e)}
                    required
                  />
                  <div
                    className="absolute right-7 top-1/2 transform -translate-y-1/2 pointer-events-auto text-[#424242] cursor-pointer"
                    onClick={() => toggleHoursDropdownStart(index)}
                  >
                    ^
                  </div>
                  {showHoursDropdownStart[index] && (
                    <div className="absolute bg-white border border-[#E0E0E0] w-full mt-1 rounded-[4px] z-10">
                      <select
                        value={selectedHourStart}
                        onChange={(e) => handleHourStartChange(index, e)}
                        className="w-full py-2 px-4 text-[#424242] bg-white"
                      >
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i < 10 ? `0${i}` : i}:00
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <label className="mb-2.5 block text-black">End Time:</label>
                <div className="relative w-full">
                  <input
                    className="w-full rounded border border-[#E0E0E0] py-3 px-5"
                    type="time"
                    value={range.hourEnd}
                    onChange={(e) => handleHourEndChange(index, e)}
                    required
                  />
                  <div
                    className="absolute right-7 top-1/2 transform -translate-y-1/2 pointer-events-auto text-[#424242] cursor-pointer"
                    onClick={() => toggleHoursDropdownEnd(index)}
                  >
                    ^
                  </div>
                  {showHoursDropdownEnd[index] && (
                    <div className="absolute bg-white border border-[#E0E0E0] w-full mt-1 rounded-[4px] z-10">
                      <select
                        value={selectedHourEnd}
                        onChange={(e) => handleHourEndChange(index, e)}
                        className="w-full py-2 px-4 text-[#424242] bg-white"
                      >
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={i}>
                            {i < 10 ? `0${i}` : i}:00
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="bg-danger py-2 px-6 text-white"
                  onClick={() => handleRemoveTimeRange(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="bg-primary py-2 px-6 text-white"
            onClick={addTimeRange}
          >
            Ajouter Time
          </button>
        </div>

        <div className="flex justify-end gap-4.5">
          <button
            type="button"
            className="bg-meta-1 py-2 px-6 text-white"
            onClick={handleCancel}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-primary py-2 px-6 text-white"
            onClick={handleSubmit}
          >
            Ajouter
          </button>
        </div>
      </form>
    </>
  );
}

export default AddPlanningForm;
