import React, { useState, useEffect, useContext } from "react";
import { FaThumbsDown, FaThumbsUp, FaTrashAlt } from "react-icons/fa";
import "../styles/Posts.css";
import { AppContext } from "../context/AppContext";
import { likePost, dislikePost, deletePost, fetchAllPosts } from "../actions/actionPosts";

const Posts = ({
    post,
    currentUser,
    setShowComments,
    setPost,
    deleteOption = false,
    onDelete,
    onCommentAdded,
}) => {
    const { categories, setPosts } = useContext(AppContext);
    const {
        content,
        title,
        likes = [],
        dislikes = [],
        comments = [],
        categories: postCategories = [],
    } = post;
    const [likeFill, setLikeFill] = useState(false);
    const [likeCount, setLikeCount] = useState(likes.length);
    const [dislikeFill, setDislikeFill] = useState(false);
    const [dislikeCount, setDislikeCount] = useState(dislikes.length);

    useEffect(() => {
        const userLiked = likes.some((like) => like.profile === currentUser.username);
        const userDisliked = dislikes.some((dislike) => dislike.profile === currentUser.username);
        setLikeFill(userLiked);
        setDislikeFill(userDisliked);
        setLikeCount(likes.length);
        setDislikeCount(dislikes.length);
    }, [likes, dislikes, currentUser.username]);

    const handleLike = async () => {
        try {
            const unlike = likeFill;
            await likePost(post.id, currentUser.id, unlike);
            const token = localStorage.getItem("token");
            const updatedPosts = await fetchAllPosts(token);
            setPosts(updatedPosts);
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const handleDislike = async () => {
        try {
            const undislike = dislikeFill;
            await dislikePost(post.id, currentUser.id, undislike);
            const token = localStorage.getItem("token");
            const updatedPosts = await fetchAllPosts(token);
            setPosts(updatedPosts);
        } catch (error) {
            console.error("Error disliking post:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await deletePost(post.id, currentUser.id);
            onDelete(post.id);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const getCategoryNames = () => {
        return postCategories.map((catId) => {
            const category = categories.find((cat) => cat.id === catId);
            return category ? category.name : "Unknown Category";
        });
    };

    return (
        <div
            style={{ maxWidth: "40rem" }}
            id="post-container"
            className="inner-main-body p-2 p-sm-3 forum-content show"
        >
            <div className="card mb-2" style={{ maxWidth: "40rem" }}>
                <div className="card-body p-2 p-sm-3">
                    <div className="d-flex flex-column">
                        {deleteOption && (
                            <FaTrashAlt
                                className="delete-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                style={{
                                    alignSelf: "flex-end",
                                    cursor: "pointer",
                                    color: "red",
                                }}
                            />
                        )}
                        <div className="media-body">
                            <div className="">
                                <h6 className="text-body">{title}</h6>
                                <section id="cats">
                                    {getCategoryNames().map((categoryName, index) => (
                                        <div key={index}>
                                            <span className="badge badge-secondary mr-2">
                                                {categoryName}
                                            </span>
                                        </div>
                                    ))}
                                </section>
                            </div>
                            <p>{content}</p>
                        </div>
                        <div className="text-muted small text-center align-self-center align-items-center">
                            <span
                                onClick={handleLike}
                                className="d-sm-inline-block"
                            >
                                {likeFill ? (
                                    <FaThumbsUp className="like" />
                                ) : (
                                    <FaThumbsUp className="none" />
                                )}
                                {likeCount}
                            </span>
                            <span
                                onClick={handleDislike}
                                className="d-sm-inline-block ml-2"
                            >
                                {dislikeFill ? (
                                    <FaThumbsDown className="dislike" />
                                ) : (
                                    <FaThumbsDown className="none" />
                                )}
                                {dislikeCount}
                            </span>
                            <span onClick={() => setShowComments(true)}>
                                <button
                                    type="button"
                                    data-toggle="modal"
                                    data-target="#exampleModalLong"
                                    style={{ border: "none" }}
                                >
                                    <i className="far fa-comment ml-2"></i>
                                    {comments.length}
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Posts;
