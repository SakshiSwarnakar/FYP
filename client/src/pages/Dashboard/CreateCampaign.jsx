import {
  CalendarDays,
  FileText,
  ImagePlus,
  MapPin,
  Tag,
  Type,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../axios/axios";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import { useCampaign } from "../../context/CampaignContext";

const categories = ["Health", "Education", "Environment", "Social Work"];

const FieldWrapper = ({ label, icon, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
      {icon && <span className="text-primary/60">{icon}</span>}
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
        {error.message}
      </p>
    )}
  </div>
);

const inputClass = (hasError) =>
  `w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all duration-150 outline-none
   focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-white
   ${hasError ? "border-red-400 bg-red-50/30" : "border-primary/15 hover:border-primary/30"}`;

function CreateCampaign() {
  const { user } = useAuth();
  const { fetchCampaigns } = useCampaign();
  const { id } = useParams();

  const [existingFiles, setExistingFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
    watch,
    resetField,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      location: "",
      startDate: "",
      endDate: "",
      attachments: [],
      createdBy: user?.id || sessionStorage.getItem("id"),
    },
  });

  /* ── Fetch campaign when editing ── */
  useEffect(() => {
    if (!id) {
      setExistingFiles(null);
      reset({
        title: "",
        description: "",
        category: "",
        location: "",
        startDate: "",
        endDate: "",
        attachments: [],
        createdBy: user?.id,
      });
      return;
    }
    const fetchCampaign = async () => {
      try {
        const { data } = await api.get(`/campaign/${id}`);
        reset({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          location: data.location || "",
          date: data.date?.split("T")[0] || "",
          attachments: [],
          createdBy: data.createdBy,
        });
        setExistingFiles(data.attachments || []);
      } catch {
        toast.error("Failed to load campaign");
      }
    };
    fetchCampaign();
  }, [id, reset]);

  const file = watch("attachments")?.[0];

  /* ── Preview for new file ── */
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  /* ── Submit ── */
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "attachments") formData.append(key, value);
      });
      if (data.attachments?.length > 0) {
        Array.from(data.attachments).forEach((f) =>
          formData.append("attachments", f),
        );
      }
      const endpoint = id ? `/campaign/${id}` : "/campaign";
      const method = id ? "put" : "post";
      await api[method](endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(id ? "Campaign updated" : "Campaign created");
      reset();
      fetchCampaigns();
    } catch (err) {
      if (err.errors) {
        err.errors.forEach((e) => {
          setError(e.field, { message: e.message });
          toast.error(e.message);
        });
      }
    }
  };

  const hasPreview = previewUrl || existingFiles?.length > 0;

  return (
    <div className="px-1 py-2">
      {/* ── Header ── */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-primary tracking-tight leading-tight">
          {id ? "Edit Campaign" : "Create Campaign"}
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          {id
            ? "Update your campaign details below."
            : "Fill in the details to launch a new campaign."}
        </p>
        <div className="mt-4 w-12 h-1 rounded-full bg-primary/40" />
      </div>

      <div className="flex items-start flex-wrap md:flex-nowrap gap-8 max-w-7xl">
        {/* ── Form Card ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full md:w-3xl bg-white border border-primary/12 rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />

          <div className="p-6 md:p-8 space-y-6">
            {/* Title */}
            <FieldWrapper
              label="Title"
              icon={<Type size={14} />}
              error={errors.title}
            >
              <input
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Must be at least 3 characters",
                  },
                })}
                placeholder="e.g. Beach Cleanup Drive"
                className={inputClass(errors.title)}
              />
            </FieldWrapper>

            {/* Description */}
            <FieldWrapper
              label="Description"
              icon={<FileText size={14} />}
              error={errors.description}
            >
              <textarea
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Must be at least 10 characters",
                  },
                })}
                rows={4}
                placeholder="Describe what this campaign is about..."
                className={`${inputClass(errors.description)} resize-none`}
              />
            </FieldWrapper>

            {/* Category */}
            <FieldWrapper
              label="Category"
              icon={<Tag size={14} />}
              error={errors.category}
            >
              <select
                {...register("category", { required: "Category is required" })}
                className={inputClass(errors.category)}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </FieldWrapper>

            {/* Location + Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FieldWrapper
                label="Location"
                icon={<MapPin size={14} />}
                error={errors.location}
              >
                <input
                  {...register("location", {
                    required: "Location is required",
                  })}
                  placeholder="City, Country"
                  className={inputClass(errors.location)}
                />
              </FieldWrapper>

              <FieldWrapper
                label="Start Date"
                icon={<CalendarDays size={14} />}
                error={errors.startDate}
              >
                <input
                  type="date"
                  {...register("startDate", {
                    required: "Start date is required",
                  })}
                  className={inputClass(errors.startDate)}
                />
              </FieldWrapper>

              <FieldWrapper
                label="End Date"
                icon={<CalendarDays size={14} />}
                error={errors.endDate}
              >
                <input
                  type="date"
                  {...register("endDate", { required: "End date is required" })}
                  className={inputClass(errors.endDate)}
                />
              </FieldWrapper>
            </div>

            {/* Attachment Upload */}
            <FieldWrapper
              label="Attachment"
              icon={<Upload size={14} />}
              error={errors.attachments}
            >
              <div className="relative w-full md:w-1/2">
                <input
                  type="file"
                  {...register("attachments", {
                    required: !id && "Attachment is required",
                    validate: (files) => {
                      if (!files || files.length === 0) return true;
                      return (
                        files[0].size <= 1024 * 1024 ||
                        "File size must be ≤ 1MB"
                      );
                    },
                  })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed transition-all duration-150
                  ${
                    errors.attachments
                      ? "border-red-300 bg-red-50/30"
                      : "border-primary/20 bg-primary/3 hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ImagePlus size={15} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-600 truncate">
                      {file?.name ||
                        (id && existingFiles?.[existingFiles.length - 1]?.url
                          ? existingFiles[existingFiles.length - 1].name ||
                            existingFiles[existingFiles.length - 1].url
                              .split("/")
                              .pop()
                          : "Click to upload")}
                    </p>
                    <p className="text-xs text-gray-400">Max size: 1MB</p>
                  </div>
                </div>
              </div>
            </FieldWrapper>

            {/* Submit */}
            <div className="pt-2 border-t border-primary/8">
              {!isSubmitting ? (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 hover:-translate-y-px active:translate-y-0 transition-all duration-150 shadow-sm"
                >
                  {id ? "Update Campaign" : "Create Campaign"}
                </button>
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </form>

        {/* ── Image Preview ── */}
        {hasPreview && (
          <div className="relative rounded-2xl overflow-hidden border border-primary/15 shadow-sm bg-white max-w-sm w-full flex-shrink-0">
            <div className="h-1 w-full bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Preview
                </p>
                <button
                  type="button"
                  onClick={() => {
                    resetField("attachments");
                    setExistingFiles([]);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="rounded-xl overflow-hidden bg-gray-50 border border-primary/8">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    className="w-full max-h-64 object-cover"
                    alt="preview"
                  />
                )}
                {!previewUrl && existingFiles?.[0]?.url && (
                  <img
                    src={existingFiles[0].url}
                    className="w-full max-h-64 object-cover"
                    alt="existing"
                  />
                )}
              </div>

              {file?.name && (
                <p className="mt-2 text-xs text-gray-400 truncate text-center">
                  {file.name}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateCampaign;
