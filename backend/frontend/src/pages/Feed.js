import { useContext, useState, useEffect } from "react";
import "../styles/Home.css";
import Posts from "../components/Posts";
import Comments from "../components/Comments";
import Filters from "../containers/Filters";
import { AppContext } from "../context/AppContext";

const Feed = () => {
    const { user, categories, posts: allPosts, setPosts } = useContext(AppContext);
    const [visiblePostsCount, setVisiblePostsCount] = useState(15);
    const [activeFilter, setActiveFilter] = useState([]);
    const [showCommentsPostId, setShowCommentsPostId] = useState(null);
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        const filtered = allPosts.filter((post) =>
            post.categories.some((category) =>
                user.profile_data.ctg_following.some(
                    (followedCategory) => followedCategory.name === category.name
                )
            )
        );
        setFilteredPosts(filtered);
    }, [allPosts, user.profile_data.ctg_following]);

    useEffect(() => {
        if (activeFilter.length === 0) {
            const filtered = allPosts.filter((post) =>
                post.categories.some((category) =>
                    user.profile_data.ctg_following.some(
                        (followedCategory) => followedCategory.name === category.name
                    )
                )
            );
            setFilteredPosts(filtered);
        } else if (activeFilter.length === 1) {
            const filtered = allPosts.filter(
                (post) =>
                    post.categories.some(
                        (category) => category.name === activeFilter[0].name
                    ) &&
                    post.categories.some((category) =>
                        user.profile_data.ctg_following.some(
                            (followedCategory) => followedCategory.name === category.name
                        )
                    )
            );
            setFilteredPosts(filtered);
        }
    }, [activeFilter, allPosts, user.profile_data.ctg_following]);

    const handleLoadMore = () => {
        setVisiblePostsCount((prevCount) => prevCount + 15);
    };

    const handleCommentAdded = (postId, newComment) => {
        const updatedPosts = allPosts.map((post) => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: [...post.comments, newComment],
                };
            }
            return post;
        });
        setPosts(updatedPosts);
    };

    const handleCommentDeleted = (postId, commentId) => {
        const updatedPosts = allPosts.map((post) => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: post.comments.filter((comment) => comment.id !== commentId),
                };
            }
            return post;
        });
        setPosts(updatedPosts);
    };

    const handlePostDeleted = (postId) => {
        const updatedPosts = allPosts.filter(post => post.id !== postId);
        setPosts(updatedPosts);
    };

    const sortedPosts = filteredPosts
        .sort((a, b) => b.id - a.id)
        .slice(0, visiblePostsCount);

    return (
        <>
            <div className="home-container">
                <Filters
                    categories={Array.isArray(categories) ? categories : []}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />
                <div className="inner-main d-flex flex-column align-items-center">
                    <h1 className="mt-2 ml-3 display-4">My Feed</h1>

                    {sortedPosts.length > 0 ? (
                        sortedPosts.map((post) => (
                            <div key={post.id} className="centered-items">
                                <Posts
                                    setPost={() => {}}
                                    showCommets={showCommentsPostId === post.id}
                                    setShowComments={() => setShowCommentsPostId(post.id)}
                                    currentUser={user}
                                    post={post}
                                    onCommentAdded={handleCommentAdded}
                                    onCommentDeleted={handleCommentDeleted}
                                    deleteOption={post.user_id === user.id}
                                    onDelete={handlePostDeleted}
                                />
                                {showCommentsPostId === post.id && (
                                    <Comments
                                        currentUser={user}
                                        currentPost={post}
                                        setShowComments={() => setShowCommentsPostId(null)}
                                        onCommentAdded={handleCommentAdded}
                                        onCommentDeleted={handleCommentDeleted}
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="ml-2 mt-5 text-holder-no-categories">
                            <h1>Woops!</h1>
                            <h4>There are no posts for your feed!</h4>
                            <div className="text-holder-no-categories-second">
                                <p>
                                    Check{" "}
                                    <em>
                                        <b>Home</b>
                                    </em>{" "}
                                    page, then go to{" "}
                                    <em>
                                        <b>My Profile</b>
                                    </em>{" "}
                                    and click on{" "}
                                    <em>
                                        <b>Categories</b>
                                    </em>{" "}
                                    tab and select your favorite topics.
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="post-counter">
                        {sortedPosts.length}/{filteredPosts.length} posts shown
                    </div>
                    {sortedPosts.length < filteredPosts.length && (
                        <div className="load-more" onClick={handleLoadMore}>
                            Load more...
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-size: 24px;
                    font-weight: bold;
                }
                .post-counter {
                    margin-top: 20px;
                    font-size: 20px;
                    font-weight: bold;
                    padding-bottom: 20px;
                    margin-bottom: 8rem;
                }
                .load-more {
                    cursor: pointer;
                    color: blue;
                    text-decoration: underline;
                    font-weight: bold;
                    padding-bottom: 40px;
                }
                .load-more:hover {
                    color: darkblue;
                }`}</style>
        </>
    );
};

export default Feed;
