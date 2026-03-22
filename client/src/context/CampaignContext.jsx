import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../axios/axios";
import { useAuth } from "./AuthContext";

const CampaignContext = createContext(null);

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState(null);
  const [activeCampaign, choseCampaign] = useState(null);
  const [myAttendance, setMyAttendance] = useState(null);
  // Change to an object to store comments by ratingId
  const [commentsByRating, setCommentsByRating] = useState({});
  const [status, setStatus] = useState(null); // error || loading || success
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchCampaigns({ createdBy: user?.id });
      return;
    }
    fetchCampaigns();
  }, [user]);

  const handlePagination = (page) => {
    fetchCampaigns({ page });
  };

  const fetchCampaigns = async (query = null) => {
    setStatus("loading");
    try {
      const res = await api.get("/campaign", {
        params: query ? { ...query } : {},
      });
      setCampaigns(res?.data);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    } finally {
      setStatus(null);
    }
  };

  const handleRegister = async (campaignId) => {
    try {
      const res = await api.post(`/campaign/${campaignId}/apply`, { user });
      if (res.status == 'success') {
        toast.success(res.message);
        return 'pending';
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handlePublish = async (campaignId) => {
    try {
      const res = await api.patch(`/campaign/${campaignId}/publish`);
      if (res.status == 'success') {
        toast.success(res.message);
        return 'published';
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchMyAttendance = async (query) => {
    const params = new URLSearchParams(query).toString();

    try {
      const res = await api.get(`attendance/volunteers/me/attendance?${params}`);

      if (res.status !== 'success') {
        throw new Error(res.error.message);
      }
      setMyAttendance(res.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVolunteerAttendance = async (id, attendanceStatus, volunteerId) => {
    try {
      const res = await api.patch(
        `/attendance/${id}/attendance/${volunteerId}`,
        { attendanceStatus }
      );
      if (res.status == 'success') {
        toast.success(res.message);
        fetchCampaigns({ createdBy: user?.id });
        return res.data;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteComment = async (commentId, ratingId) => {
    try {
      const res = await api.delete(`/comment/${commentId}`);

      if (res.status !== "success") {
        throw new Error("Failed to delete comment");
      }

      // Remove comment from the specific rating's comments
      setCommentsByRating((prev) => ({
        ...prev,
        [ratingId]: prev[ratingId]?.filter((c) => c._id !== commentId) || []
      }));

      toast.success("Comment deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addComment = async (id, ratingId, comment, parentId = null) => {
    if (!comment.trim()) return;

    try {
      const res = await api.post(`/campaign/${id}/ratings/${ratingId}/comments`, { 
        comment, 
        parentId 
      });

      if (res.status !== "success") {
        throw new Error(res?.data?.error?.message || "Error Adding Comment.");
      }

      toast.success("Comment Added");

      // Refresh comments for this specific rating
      loadComments(id, ratingId);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const loadComments = async (id, ratingId) => {
    try {
      const res = await api.get(`/campaign/${id}/ratings/${ratingId}/comments`);
      if (res.status !== "success") {
        throw new Error("Failed to load comments");
      }
      
      // Store comments under the specific ratingId key
      setCommentsByRating((prev) => ({
        ...prev,
        [ratingId]: res.data
      }));

    } catch (error) {
      console.error(error.message);
    }
  };

  // Helper function to get comments for a specific rating
  const getCommentsByRating = (ratingId) => {
    return commentsByRating[ratingId] || [];
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        activeCampaign,
        status,
        myAttendance,
        commentsByRating,
        getCommentsByRating,
        loadComments,
        deleteComment,
        addComment,
        fetchMyAttendance,
        choseCampaign,
        handlePagination,
        handleVolunteerAttendance,
        handleRegister,
        fetchCampaigns,
        handlePublish
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => useContext(CampaignContext);