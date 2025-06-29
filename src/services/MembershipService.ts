import axios from "@/lib/axios";

export const getMemberships = async () => {
  const res = await axios.get("/membership");
  return res.data;
};

export const createMemberships = async (data: {
  billingPeriodMonth: string;
  cost: string;
  name: string;
  numberOfDaysInWeek: string;
  stripePriceId: string;
  type: string;
  unit: string;
}) => {
  const res = await axios.post("/membership", data);
  return res.data;
};

export const updateMemberships = async (
  id: string,
  data: {
    billingPeriodMonth: string;
    cost: string;
    name: string;
    numberOfDaysInWeek: string;
    stripePriceId: string;
    type: string;
    unit: string;
  }
) => {
  const res = await axios.put(`/membership?id=${id}`, data);
  return res.data;
};

export const deleteMemberships = async (id: string) => {
  const res = await axios.delete(`/membership?id=${id}`);
  return res.data;
};
