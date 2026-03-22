import { Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../axios/axios";

function CreateTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    points: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points" ? value : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments(files);

    // Generate previews (only for images)
    const imagePreviews = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));

    setPreviews(imagePreviews);

    // Cleanup old object URLs
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.points === "" || Number(formData.points) < 0)
      newErrors.points = "Enter a valid number of points (≥ 0)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("points", Number(formData.points));

      for (const file of attachments) {
        data.append("attachments", file);
      }

      const res = await api.post(`/task/campaigns/${id}/tasks`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.status === "success") {
        toast.success(res.data.message || "Task created successfully");
        navigate(-1);
      } else {
        toast.error(res.data?.message || "Something went wrong");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create task";
      toast.error(message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = attachments.filter((_, i) => i !== index);
    setAttachments(newFiles);

    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-2xl border border-primary/15 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-primary/10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Create New Task
          </h2>
          <p className="mt-2 text-gray-600">
            Add a new task to this campaign — volunteers will see it and can
            submit proof.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-7">
          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Clean the local park trails"
              className={`
                w-full px-4 py-2.5 rounded-xl border
                ${errors.title ? "border-red-400 focus:ring-red-400/40" : "border-gray-300 focus:ring-primary/40 focus:border-primary/40"}
                bg-white text-gray-800 placeholder-gray-400
                transition-all duration-200
              `}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe what volunteers need to do, any specific requirements, location, deadline, etc..."
              className={`
                w-full px-4 py-3 rounded-xl border resize-y min-h-[140px]
                ${errors.description ? "border-red-400 focus:ring-red-400/40" : "border-gray-300 focus:ring-primary/40 focus:border-primary/40"}
                bg-white text-gray-800 placeholder-gray-400
                transition-all duration-200
              `}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Points */}
          <div className="space-y-2">
            <label
              htmlFor="points"
              className="block text-sm font-medium text-gray-700"
            >
              Points Awarded <span className="text-red-500">*</span>
            </label>
            <input
              id="points"
              type="number"
              name="points"
              value={formData.points}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder="e.g. 50"
              className={`
                w-full sm:w-1/3 px-4 py-2.5 rounded-xl border
                ${errors.points ? "border-red-400 focus:ring-red-400/40" : "border-gray-300 focus:ring-primary/40 focus:border-primary/40"}
                bg-white text-gray-800 placeholder-gray-400
                transition-all duration-200
              `}
            />
            {errors.points && (
              <p className="text-sm text-red-600 mt-1">{errors.points}</p>
            )}
          </div>

          {/* Attachments */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Attachments / Reference Materials (optional)
            </label>

            <div className="relative">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center
                  ${attachments.length ? "border-primary/40 bg-primary/5" : "border-gray-300 hover:border-primary/30 bg-gray-50"}
                  transition-all duration-300 cursor-pointer group
                `}
              >
                <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-primary/70 transition-colors" />
                <p className="mt-3 text-sm text-gray-600">
                  <span className="font-medium text-primary">
                    Click to upload
                  </span>{" "}
                  or drag & drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Images, PDFs, documents (max 10MB per file recommended)
                </p>
              </div>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm group"
                  >
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                flex-1 sm:flex-none px-8 py-3 rounded-xl font-medium text-white
                bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40
                shadow-sm transition-all active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className={`
                flex-1 sm:flex-none px-8 py-3 rounded-xl font-medium
                border border-gray-300 text-gray-700 hover:bg-gray-50
                transition-all active:scale-[0.98]
                disabled:opacity-60
              `}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
