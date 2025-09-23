import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDestinationDetails } from "../api/dashboardApi";

const DestinationDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getDestinationDetails(id);
        setDetails(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  if (!details) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{details.dest.name}</h1>
      <p>Capacity: {details.dest.capacity}</p>
      <p>Booked: {details.dest.bookedNo}</p>
      <h2 className="text-lg font-semibold mt-4">Permits:</h2>
      <ul>
        {details.permits.map((p) => (
          <li key={p._id}>
            {p.userId.name} - {p.userId.email} ({p.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DestinationDetails;
