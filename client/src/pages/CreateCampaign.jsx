import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import { api } from "../axios/axios"
import Loading from "../components/Loading"
import { useAuth } from "../context/AuthContext"
import { Upload, X } from "lucide-react"

function CreateCampaign() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {id} = useParams()
  const [existingFiles, setExistingFiles] = useState([])
  const [previewUrl, setPreviewUrl] = useState(null)

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
      date: "",
      attachments: [],
      createdBy: user?.id || sessionStorage.getItem("id"),
    },
  })

  const file = watch("attachments")?.[0]

  /* ---------------- Preview for new file ---------------- */
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [file])

  /* ---------------- Fetch campaign when editing ---------------- */
  useEffect(() => {
    if (!id) return

    const fetchCampaign = async () => {
      try {
        const { data } = await api.get(`/campaign/${id}`)
        reset({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          location: data.location || "",
          date: data.date?.split("T")[0] || "",
          attachments: [], // keep RHF clean
          createdBy: data.createdBy,
        })

        setExistingFiles(data.attachments || [])
      } catch (err) {
        toast.error("Failed to load campaign")
      }
    }

    fetchCampaign()
  }, [id, reset])

  /* ---------------- Submit ---------------- */
  const onSubmit = async (data) => {
    try {
      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "attachments") formData.append(key, value)
      })

      if (data.attachments?.length > 0) {
        Array.from(data.attachments).forEach((file) => {
          formData.append("attachments", file)
        })
      }

      const endpoint = id ? `/campaign/${id}` : "/campaign/"
      const method = id ? "put" : "post"

      await api[method](endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success(id ? "Campaign updated" : "Campaign created")
      // navigate("/dashboard")
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) =>
          setError(e.field, { message: e.message })
        )
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  const categories = ["Health", "Education", "Environment", "Social Work"]

  return (
    <div>
      <h1 className="text-5xl font-bold text-primary mb-10">
        {id ? "Edit Campaign" : "Create Campaign"}
      </h1>
      <div className="flex gap-6 max-w-7xl w-5xl">

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-5xl space-y-6 rounded-lg bg-white p-6 shadow"
        >
          {/* Title */}
          <div>
            <label className="font-medium">Title</label>
            <input
              {...register("title", { required: "Title is required" })}
              className={`w-full border p-2 rounded ${errors.title ? "border-red-500" : "border-border"}`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-medium">Description</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              className={`w-full border p-2 rounded ${errors.description ? "border-red-500" : "border-border"}`}
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-medium">Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              className={`w-full border p-2 rounded ${errors.category ? "border-red-500" : "border-border"}`}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Location & Date */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="font-medium">Location</label>
              <input
                {...register("location", { required: "Location is required" })}
                className={`w-full border p-2 rounded ${errors.location ? "border-red-500" : "border-border"}`}
              />
            </div>

            <div className="flex-1">
              <label className="font-medium">Date</label>
              <input
                type="date"
                {...register("date", { required: "Date is required" })}
                className={`w-full border p-2 rounded ${errors.date ? "border-red-500" : "border-border"}`}
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="relative w-1/2 space-y-2">
            <label className="font-medium">Attachments</label>

            <input
  type="file"
  {...register('attachments', {
    validate: files => {
      if (!files || files.length === 0) return true; // OPTIONAL
      return (
        files[0].size <= 1024 * 1024 ||
        'File size must be ≤ 1MB'
      );
    },
  })}
/>

            <div className={`flex items-center gap-2 border p-2 rounded ${errors.attachments ? "border-red-500" : "border-border"}`}>
              <Upload size={18} className="text-neutral-500" />

              <span className="text-sm text-neutral-600 truncate">
                {file?.name ||
                  (id && existingFiles?.[0]?.url
                    ? existingFiles[0].name || existingFiles[0].url.split("/").pop()
                    : "Upload attachment")}
              </span>
            </div>

            {errors.attachments && (
              <p className="text-red-500 text-sm">{errors.attachments.message}</p>
            )}
          </div>



          {/* Submit */}
          <div>
            {!isSubmitting ? (
              <button className="primary-btn" type="submit">
                {id ? "Update" : "Create"} Campaign
              </button>
            ) : (
              <Loading />
            )}
          </div>

        </form>
        {/* Preview */}
        {(previewUrl || existingFiles?.length > 0) && (
          <div className=" relative w-fit rounded">
            <button
              type="button"
              className="absolute -top-3 -right-3 bg-white border rounded-full p-1"
              onClick={() => {
                resetField("attachments")
                setExistingFiles([])
              }}
            >
              <X size={14} />
            </button>

            {previewUrl && (
              <img src={previewUrl} className="max-h-64 rounded" />
            )}

            {!previewUrl && existingFiles?.[0]?.url && (
              <img src={existingFiles[0].url} className="max-h-64 rounded" />
            )}
          </div>
        )}
      </div>



    </div>
  )
}

export default CreateCampaign