"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Select from "@/components/ui/selectBox";
import TextField from "@/components/ui/textArea";
import toast from "react-hot-toast";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import doctorFactory from "@/actions/doctorAction";
import { decodeSlug } from "@/utils/helper";
import { useSearchParams } from "next/navigation";

const schema = yup.object().shape({
  recommendation: yup.string().required("Please select recommendation"),
  specialization: yup.string().required("Please choose specialization"),
  mostHappyWith: yup.array().min(1, "Please select at least one"),
  desc: yup.string().required("Please enter your experience"),
});

const defaultValues = {
  recommendation: "",
  specialization: "",
  mostHappyWith: [],
  desc: "",
  isAnonymous: false,
};

const defaultHappyOptions = [
  "Doctor friendliness",
  "Explanation of the health issue",
  "Treatment satisfaction",
  "Value for money",
  "Wait time",
];

export default function WriteReview() {
  const searchParams = useSearchParams();
  const { doctorId } = useParams();
  const router = useRouter();
  const { docId } = decodeSlug(doctorId);
  const id = searchParams.get("id");
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const [details, setDetails] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await doctorFactory.doctorSpecialization(docId);
        setDetails(res.data.data);
      } catch (e) {
        console.error(e);
      }
    };

    const fetchReview = async () => {
      try {
        if (id) {
          const res = await doctorFactory.getReviewDetails(id);
          const data = res.data.data;

          setValue("recommendation", data.recommendation);
          setValue("specialization", data.specialization.id);
          setValue("mostHappyWith", data.mostHappyWith);
          setValue("desc", data.desc);
          setValue("isAnonymous", data.isAnonymous);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchDetails();
    fetchReview();
  }, []);

  const onSubmit = async (data) => {
    try {
      const specializationObj = details?.specialization.find(
        (item) => item._id === data.specialization
      );
      const payload = {
        ...data,
        specialization: {
          name: specializationObj?.name,
          id: specializationObj?._id,
        },
        doctorId: docId,
      };
      setIsSubmit(true);

      if (id) {
        await doctorFactory.editPatientReview(payload, review_id);
      } else {
        await doctorFactory.savePatientReview(payload);
      }

      toast.success(
        "Your review has been successfully submitted. After approval your review will be published."
      );
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-2">
        How was your appointment experience with Dr. Reshma Phulwar?
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Please take a moment to share your feedback.
      </p>

      {/* Recommendation */}
      <div className="mb-6">
        <label className="font-medium">
          Would you like to recommend the doctor?*
        </label>
        <div className="flex gap-4 mt-2">
          <Controller
            control={control}
            name="recommendation"
            render={({ field }) => (
              <>
                <button
                  type="button"
                  className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded ${
                    field.value === "yes"
                      ? "bg-green-100 border-green-400"
                      : "border-gray-300"
                  }`}
                  onClick={() => field.onChange("yes")}
                >
                  <FaThumbsUp /> Yes
                </button>
                <button
                  type="button"
                  className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded ${
                    field.value === "no"
                      ? "bg-red-100 border-red-400"
                      : "border-gray-300"
                  }`}
                  onClick={() => field.onChange("no")}
                >
                  <FaThumbsDown /> No
                </button>
              </>
            )}
          />
        </div>
        {errors.recommendation && (
          <p className="text-red-500 text-sm mt-1">
            {errors.recommendation.message}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="font-medium">
          For which health problem/treatment did you visit?*
        </label>
        <Controller
          control={control}
          name="specialization"
          render={({ field }) => (
            <Select
              options={
                details?.specialization.map((s) => ({
                  label: s.name,
                  value: s._id,
                })) || []
              }
              {...field}
            />
          )}
        />
        {errors.specialization && (
          <p className="text-red-500 text-sm mt-1">
            {errors.specialization.message}
          </p>
        )}
      </div>

      {/* Most Happy With */}
      <div className="mb-6">
        <label className="font-medium">What were you most happy with?*</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {defaultHappyOptions.map((option) => (
            <Controller
              key={option}
              control={control}
              name="mostHappyWith"
              render={({ field }) => {
                const isChecked = field.value.includes(option);
                return (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        const newValue = isChecked
                          ? field.value.filter((v) => v !== option)
                          : [...field.value, option];
                        field.onChange(newValue);
                      }}
                    />
                    <span>{option}</span>
                  </label>
                );
              }}
            />
          ))}
        </div>
        {errors.mostHappyWith && (
          <p className="text-red-500 text-sm mt-1">
            {errors.mostHappyWith.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="font-medium">
          Tell us about your experience with the doctor *
        </label>
        <Controller
          control={control}
          name="desc"
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Write your review here..."
              className="w-full h-32 mt-2"
            />
          )}
        />
        {errors.desc && (
          <p className="text-red-500 text-sm mt-1">{errors.desc.message}</p>
        )}
      </div>

      {/* Anonymous Checkbox */}
      <div className="mb-6">
        <Controller
          control={control}
          name="isAnonymous"
          render={({ field }) => (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              <span>Keep this story publicly anonymous</span>
            </label>
          )}
        />
      </div>

      <Button
        onClick={handleSubmit(onSubmit)}
        className="cursor-pointer"
        disabled={isSubmit}
      >
        Submit
      </Button>
    </div>
  );
}
