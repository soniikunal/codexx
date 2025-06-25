import axios from "@/lib/axios";

export const getLocations = async () => {
  const res = await axios.get("/locations");
  return res.data;
};

export const createLocation = async (data: {
  fullName: string;
  shortName: string;
  address: string;
}) => {
  const res = await axios.post("/locations", data);
  return res.data;
};

export const updateLocation = async (
  id: string,
  data: { fullName: string; shortName: string; address: string }
) => {
  const res = await axios.put(`/locations/${id}`, data);
  return res.data;
};

export const deleteLocation = async (id: string) => {
  const res = await axios.delete(`/locations/${id}`);
  return res.data;
};
