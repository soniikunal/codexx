import mongoose, { Schema, model, models } from "mongoose";

export interface Enrollment {
  courseName: string;
  createdAt: Date;

  familyInfo: {
    address: string;
    city: string;
    email: string;
    name: string;
    state: string;
    zip: string;
  };

  membership: {
    membershipId: string;
    billingPeriodMonth: number;
    cost: string;
    name: string;
    numberOfDaysInWeek: number;
    stripePriceId: string;
    type: string;
    unit: string;
  };

  paymentInfo: {
    card: {
      address_zip?: string;
      address_zip_check?: string;
      brand: string;
      country: string;
      cvc_check: string;
      exp_month: number;
      exp_year: number;
      funding: string;
      id: string;
      last4: string;
      object: string;
    };
    client_ip: string;
    created: number;
    id: string;
    livemode: boolean;
    object: string;
    type: string;
    used: boolean;
  };

  proRatedAmount: number;

  schedule: Array<{
    disabled: boolean;
    selected: boolean;
    weekDay: string;
    time: Array<{
      from: string;
      id: string;
      to: string;
    }>;
  }>;

  signupFee: number;

  studentInfo: {
    dob: string;
    firstName: string;
    lastName: string;
  };
}

const EnrollmentSchema = new Schema<Enrollment>({
  courseName: { type: String, required: true },
  createdAt: { type: Date, required: true },

  familyInfo: {
    address: { type: String },
    city: { type: String },
    email: { type: String },
    name: { type: String },
    state: { type: String },
    zip: { type: String },
  },

  membership: {
    membershipId: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    billingPeriodMonth: { type: Number },
    cost: { type: String },
    name: { type: String },
    numberOfDaysInWeek: { type: Number },
    stripePriceId: { type: String },
    type: { type: String },
    unit: { type: String },
  },

  paymentInfo: {
    card: {
      address_zip: { type: String },
      address_zip_check: { type: String },
      brand: { type: String },
      country: { type: String },
      cvc_check: { type: String },
      exp_month: { type: Number },
      exp_year: { type: Number },
      funding: { type: String },
      id: { type: String },
      last4: { type: String },
      object: { type: String },
    },
    client_ip: { type: String },
    created: { type: Number },
    id: { type: String },
    livemode: { type: Boolean },
    object: { type: String },
    type: { type: String },
    used: { type: Boolean },
  },

  proRatedAmount: { type: Number },

  schedule: [
    {
      disabled: { type: Boolean },
      selected: { type: Boolean },
      weekDay: { type: String },
      time: [
        {
          from: { type: String },
          id: { type: String },
          to: { type: String },
        },
      ],
    },
  ],

  signupFee: { type: Number },

  studentInfo: {
    dob: { type: String },
    firstName: { type: String },
    lastName: { type: String },
  },
});

export default models.Enrollment ||
  model<Enrollment>("Enrollment", EnrollmentSchema);
